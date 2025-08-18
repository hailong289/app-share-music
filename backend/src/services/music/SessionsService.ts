import { BaseService } from "../BaseService";
import { ISession, ISessionItem } from "@/types/music.types";
import { SessionItems, Sessions } from "@/models";

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
    return await this.findById(sessionId);
  }

  public async updateSession(sessionId: string, updateData: Partial<ISession>): Promise<ISession | null> {
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
