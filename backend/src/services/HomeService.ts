import { Sessions } from "@/models";
import { BaseService } from "./BaseService";
import { ISession } from "@/types/music.types";

class HomeService extends BaseService<ISession> {

  public constructor() {
    super(Sessions);
  }

  public getList(): Promise<any[]> {
    const query = this.model.aggregate([
      {
        $match: {
          context_type: "home"
        }
      },
      {
        $sort: { order_index: 1 }
      },
      // 1) Lấy các session_items thuộc session hiện tại
      {
        $lookup: {
          from: "sessionitems",
          let: { sid: "$_id" },      // << sửa $id -> $_id
          pipeline: [
            { $match: { $expr: { $eq: ["$session_id", "$$sid"] } } },
            { $sort: { createdAt: 1 } } // optional
          ],
          as: "session_items"
        }
      },
      // 2) Tách ra danh sách id theo từng loại
      {
        $set: {
          playlist_ids: {
            $map: {
              input: { $filter: { input: "$session_items", as: "it", cond: { $eq: ["$$it.item_type", "playlist"] } } },
              as: "x",
              in: "$$x.item_id"
            }
          },
          album_ids: {
            $map: {
              input: { $filter: { input: "$session_items", as: "it", cond: { $eq: ["$$it.item_type", "album"] } } },
              as: "x",
              in: "$$x.item_id"
            }
          },
          song_ids: {
            $map: {
              input: { $filter: { input: "$session_items", as: "it", cond: { $eq: ["$$it.item_type", "song"] } } },
              as: "x",
              in: "$$x.item_id"
            }
          },
          user_ids: {
            $map: {
              input: { $filter: { input: "$session_items", as: "it", cond: { $eq: ["$$it.item_type", "user"] } } },
              as: "x",
              in: "$$x.item_id"
            }
          }
        }
      },
      // 3) Lookup từng bảng theo mảng id
      {
        $lookup: {
          from: "playlists",
          let: { ids: "$playlist_ids" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$ids"] } } },
            {
              $addFields: {
                banner_url: {
                  $concat: [
                    `${process.env.APP_URL}/`,
                    { $replaceAll: { input: "$banner_url", find: "\\", replacement: "/" } }
                  ]
                }
              }
            },
            {
              $lookup: {
                from: "users",
                let: { memberIds: "$members" }, // members là mảng userId
                pipeline: [
                  { $match: { $expr: { $in: ["$_id", "$$memberIds"] } } },
                  {
                    $addFields: {
                      image_url: {
                        $cond: [
                          { $regexMatch: { input: { $toString: "$image_url" }, regex: /^http/ } },
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
                as: "artists"
              }
            }
          ],
          as: "playlist_docs"
        }
      },
      {
        $lookup: {
          from: "albums",
          let: { ids: "$album_ids" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$ids"] } } },
            {
              $addFields: {
                cover_url: {
                  $concat: [
                    `${process.env.APP_URL}/`,
                    { $replaceAll: { input: "$cover_url", find: "\\", replacement: "/" } }
                  ]
                }
              }
            },
            {
              $lookup: {
                from: "users",
                localField: "artist_id",
                foreignField: "_id",
                as: "artist"
              }
            }
          ],
          as: "album_docs"
        }
      },
      {
        $lookup: {
          from: "songs",
          let: { ids: "$song_ids" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$ids"] } } },
            {
              $addFields: {
                banner_url: {
                  $concat: [
                    `${process.env.APP_URL}/`,
                    { $replaceAll: { input: "$banner_url", find: "\\", replacement: "/" } }
                  ]
                },
                audio_url: {
                  $concat: [
                    `${process.env.APP_URL}/`,
                    { $replaceAll: { input: "$audio_url", find: "\\", replacement: "/" } }
                  ]
                }
              }
            }
          ],
          as: "song_docs"
        }
      },
      {
        $lookup: {
          from: "users",
          let: { ids: "$user_ids" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$ids"] } } }
          ],
          as: "user_docs"
        }
      },

      // 4) Gắn document thật vào từng session_item theo item_type + item_id
      {
        $set: {
          session_items: {
            $map: {
              input: "$session_items",
              as: "it",
              in: {
                $mergeObjects: [
                  "$$it",
                  {
                    item: {
                      $switch: {
                        branches: [
                          {
                            case: { $eq: ["$$it.item_type", "playlist"] },
                            then: {
                              $first: {
                                $filter: {
                                  input: "$playlist_docs",
                                  as: "d",
                                  cond: { $eq: ["$$d._id", "$$it.item_id"] }
                                }
                              }
                            }
                          },
                          {
                            case: { $eq: ["$$it.item_type", "album"] },
                            then: {
                              $first: {
                                $filter: {
                                  input: "$album_docs",
                                  as: "d",
                                  cond: { $eq: ["$$d._id", "$$it.item_id"] }
                                }
                              }
                            }
                          },
                          {
                            case: { $eq: ["$$it.item_type", "song"] },
                            then: {
                              $first: {
                                $filter: {
                                  input: "$song_docs",
                                  as: "d",
                                  cond: { $eq: ["$$d._id", "$$it.item_id"] }
                                }
                              }
                            }
                          },
                          {
                            case: { $eq: ["$$it.item_type", "user"] },
                            then: {
                              $first: {
                                $filter: {
                                  input: "$user_docs",
                                  as: "d",
                                  cond: { $eq: ["$$d._id", "$$it.item_id"] }
                                }
                              }
                            }
                          },
                        ],
                        default: null
                      }
                    }
                  }
                ]
              }
            },
          },
        }
      },
      {
        $match: {
          "session_items.item": { $exists: true, $ne: null } // chỉ giữ khi có item
        }
      },

      // 5) (tuỳ chọn) Chỉ giữ field cần thiết
      // {
      //   $project: {
      //     context_type: 1,
      //     order_index: 1,
      //     session_items: {
      //       item_type: 1,
      //       item_id: 1,
      //       item: { title: 1, cover_url: 1, release_date: 1 }
      //     }
      //   }
      // },

      // 6) (tuỳ chọn) Dọn rác
      { $unset: ["playlist_ids", "album_ids", "song_ids", "user_ids", "playlist_docs", "album_docs", "song_docs", "user_docs"] }
    ]);
    return query;
  }
}

export default new HomeService();
