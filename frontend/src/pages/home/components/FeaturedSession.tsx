import { useMusicStore } from "@/stores/useMusicStore";
import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import toast from "react-hot-toast";

const FeaturedSession = (props) => {
  const { title = "Featured Session", isLoading, session } = props;
  const { user } = useAuthStore();
  const { session_items = [], _id } = session || {};
	if (isLoading) return <FeaturedGridSkeleton />;

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4, // số card hiển thị ngang
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

	return (
		<div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4 mb-8 px-4'>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='text-xl sm:text-2xl font-bold'>{title}</h2>
				<Link to={user ? `/session/${_id}` : null} onClick={user ? undefined : () => toast.error("Please register or login")}>
          <Button variant='link' className='text-sm text-zinc-400 hover:text-white'>
            Show all
          </Button>
        </Link>
			</div>
			<Slider {...settings}>
        {session_items.map((item) => item?.item ? (
          <div key={item.item_id} className="px-2"> {/* mỗi slide */}
            <Link
              to={user ? `/${item.item_type}/${item.item_id}` : null}
              className="block bg-zinc-800/50 hover:bg-zinc-700/50
                         rounded-md overflow-hidden transition-colors"
              onClick={user ? undefined : () => toast.error("Please register or login")}
            >
              <img
                crossOrigin="anonymous"
                src={item.item.banner_url ?? item.item.image_url ?? item.item.cover_url}
                alt={item.item.name}
                className="w-full h-40 object-cover" // đảm bảo ảnh full chiều ngang
              />
              <div className="p-3">
                <p className="font-medium truncate">{item.item.name ?? item.item.title}</p>
                <p className="text-sm text-zinc-400 truncate">{item.item?.artists ? item.item.artists.map((x) => x.name) : null}</p>
              </div>
            </Link>
          </div>
        ) : null)}
      </Slider>
		</div>
	);
};
export default FeaturedSession;
