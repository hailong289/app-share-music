import { HomeIcon, LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants, Button } from "../ui/button";
import SearchBar from "./SearchBar";
import AccountBar from "./AccountBar";

const Topbar = (props) => {
  const {isMobile = false} = props;
  const isAdmin = true;

  return (
    <div
      className="flex items-center justify-between p-4 z-10"
    >
			<div className='rounded-lg'>
        <Link
          to={"/"}
          className={cn(
            buttonVariants({
              variant: "ghost",
              className: "w-full justify-start text-white hover:bg-zinc-800 hover:text-white",
            })
          )}
        >
          <HomeIcon className='size-5' />
        </Link>
			</div>
			<div className='flex-1 flex justify-center'>
        <div className={isMobile ? "" : "w-[600px]"}>
          <SearchBar />
        </div>
			</div>

      <div className="flex items-center gap-4 text-black">
        {isAdmin && (
          <Link
            to={"/admin"}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <LayoutDashboardIcon className="size-4  mr-2" />
            Admin Dashboard
          </Link>
        )}
        <AccountBar />
      </div>
    </div>
  );
};
export default Topbar;
