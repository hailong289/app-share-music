import SectionGridSkeleton from "./components/SectionGridSkeleton";
import { useMusicStore } from "@/stores/useMusicStore";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const SessionPage = () => {
  const { sessionId } = useParams();
  const {
    isLoading,
    fetchSessionById,
    currentSession
  } = useMusicStore();

  const { items = [], name } = currentSession || {};

  useEffect(() => {
    if (sessionId) fetchSessionById(sessionId);
  }, [fetchSessionById, sessionId]);

	if (isLoading) return <SectionGridSkeleton />;

	return (
		<div className='mb-8'>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='text-xl sm:text-2xl font-bold'>{name}</h2>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4'>
				{items.map((item) => item?.item_detail ? (
          <Link
            to={`/${item.item_type}/${item.item_id}`}
            className="block bg-zinc-800/50 hover:bg-zinc-700/50
                        rounded-md overflow-hidden transition-colors"
          >
            <div
              key={item.item_id}
              className='bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer'
            >
              <div className='relative mb-4'>
                <div className='aspect-square rounded-md shadow-lg overflow-hidden'>
                  <img
                    crossOrigin="anonymous"
                    src={item.item_detail.image_url ?? item.item_detail.banner_url ?? item.item_detail.cover_url}
                    alt={item.item_detail.name}
                    className='w-full h-full object-cover transition-transform duration-300
                    group-hover:scale-105'
                  />
                </div>
              </div>
              <h3 className='font-medium mb-2 truncate'>{item.item_detail.name ?? item.item_detail.title}</h3>
              <p className='text-sm text-zinc-400 truncate'>{item.item_detail?.artists ? item.item_detail.artists.map((x) => x.name) : null}</p>
            </div>
          </Link>
				) : null)}
			</div>
		</div>
	);
};
export default SessionPage;
