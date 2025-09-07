import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { Button } from "@/components/ui/button";

const SearchItem = (props) => {
  const { title = "", isLoading, items = [], type = '' } = props;
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
			</div>
			<Slider {...settings}>
        {items.map((item) => (
          <div key={item._id} className="px-2"> {/* mỗi slide */}
            <Link
              to={`/${type}/${item._id}`}
              className="block bg-zinc-800/50 hover:bg-zinc-700/50
                         rounded-md overflow-hidden transition-colors"
            >
              <img
                crossOrigin="anonymous"
                src={item.banner_url ?? item.image_url ?? item.cover_url}
                alt={item?.name ?? item?.title}
                className="w-full h-40 object-cover" // đảm bảo ảnh full chiều ngang
              />
              <div className="p-3">
                <p className="font-medium truncate">{item?.name ?? item?.title}</p>
                <p className="text-sm text-zinc-400 truncate">{item.item?.artists ? item.artists.map((x) => x.name) : null}</p>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
		</div>
	);
};
export default SearchItem;
