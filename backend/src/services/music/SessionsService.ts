import { BaseService } from "../BaseService";
import { ISession, ISessionItem } from "@/types/music.types";
import { SessionItems, Sessions } from "@/models";
import { Types } from "mongoose";
import { pipeline } from "stream";

class SessionsService extends BaseService<ISession> {

  constructor() {
    super(Sessions);
  }

  public async getSessions(filter: any = {}): Promise<ISession[]> {
    return await this.find(filter);
  }

  public async createSession(data: Partial<any>): Promise<ISession> {
    const session = await this.create(data);
    for (const item of data.items || []) {
      const sessionItem = new SessionItems({
        item_id: item.item_id,
        item_type: item.item_type,
        session_id: session._id,
      });
      await sessionItem.save();
    }
    return session;
  }

  public async getSessionById(sessionId: string): Promise<ISession | null> {
    const session = await this.aggregate([
      {
        $match: { _id: new Types.ObjectId(sessionId) }
      },
      {
        $lookup: {
          from: "sessionitems",
          localField: "_id",
          foreignField: "session_id",
          as: "items",
          pipeline: [
            { $sort: { created_at: -1 } },
            { $limit: 10 },
            // nghệ sĩ
            {
              $lookup: {
                from: "users",
                let: { sid: "$item_id", t: "$item_type" },
                pipeline: [
                  { $match: { $expr: { $and: [{ $eq: ["$$t", "artist"] }, { $eq: ["$_id", "$$sid"] }] } } },
                  {
                    $addFields: {
                      image_url: {
                        $cond: [
                          { $regexMatch: { input: { $toString: "$image_url" }, regex: /^https?:\/\// } },
                          { $replaceAll: { input: { $toString: "$image_url" }, find: "\\", replacement: "/" } },
                          {
                            $concat: [
                              `${process.env.APP_URL}/`,
                              { $replaceAll: { input: { $toString: "$image_url" }, find: "\\", replacement: "/" } }
                            ]
                          }
                        ]
                      }
                    }
                  }
                ],
                as: "artist"
              }
            },
            // Albums
            {
              $lookup: {
                from: "albums",
                let: { sid: "$item_id", t: "$item_type" },
                pipeline: [
                  { $match: { $expr: { $and: [{ $eq: ["$$t", "album"] }, { $eq: ["$_id", "$$sid"] }] } } },
                  {
                    $addFields: {
                      cover_url: {
                        $concat: [
                          `${process.env.APP_URL}/`,
                          { $replaceAll: { input: "$cover_url", find: "\\", replacement: "/" } }
                        ]
                      }
                    }
                  }
                ],
                as: "album"
              }
            },
            // Playlists
            {
              $lookup: {
                from: "playlists",
                let: { sid: "$item_id", t: "$item_type" },
                pipeline: [
                  { $match: { $expr: { $and: [{ $eq: ["$$t", "playlist"] }, { $eq: ["$_id", "$$sid"] }] } } },
                  {
                    $addFields: {
                      banner_url: {
                        $concat: [
                          `${process.env.APP_URL}/`,
                          { $replaceAll: { input: "$banner_url", find: "\\", replacement: "/" } }
                        ]
                      }
                    }
                  }
                ],
                as: "playlist"
              }
            },
            // Coalesce về 1 field duy nhất `item_detail`
            {
              $set: {
                item_detail: {
                  $first: {
                    $concatArrays: [
                      "$artist", "$playlist", "$album"
                    ]
                  }
                }
              }
            },
            { $project: { artist: 0, playlist: 0, album: 0, session_id: 0 } }
          ]
        }
      }
    ])

    return this.convertObject(session).then(res => res.length > 0 ? res[0] : null);
  }

  public async updateSession(sessionId: string, updateData: any): Promise<ISession | null> {
    for (const item of updateData.items || []) {
      const sessionItem = new SessionItems({
        item_id: item.item_id,
        item_type: item.item_type,
        session_id: sessionId,
      });
      await sessionItem.save();
    }
    return await this.updateById(sessionId, updateData);
  }

  public async deleteSession(sessionId: string): Promise<ISession | null> {
    return await this.deleteById(sessionId);
  }

  public async createSessionItem(data: Partial<ISessionItem>): Promise<ISessionItem> {
    const sessionItem = new SessionItems(data);
    return await sessionItem.save();
  }

  public async getSessionItems(sessionId: string): Promise<ISessionItem[]> {
    return await SessionItems.find({ session_id: sessionId }).exec();
  }

  public async deleteSessionItem(itemId: string): Promise<ISessionItem | null> {
    return await SessionItems.findByIdAndDelete(itemId).exec();
  }

  public async updateSessionItem(itemId: string, updateData: Partial<ISessionItem>): Promise<ISessionItem | null> {
    return await SessionItems.findByIdAndUpdate(itemId, updateData, { new: true }).exec();
  }

}

const sessionsService = new SessionsService();
export { sessionsService };
