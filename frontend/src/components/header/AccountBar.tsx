import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { Bell, ExternalLink, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonVariants } from "../ui/button";

const AccountBar = () => {
  const { logout } = useAuthStore();
  const handleLogout = () => {
    logout();
  };
  const isPending = false;
  const srcImage = "/bases/post_malone.jpg";
  return (
    <div
      className="flex-none flex flex-row gap-2 items-center justify-center"
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
          <Bell className='size-5' />
        </Link>
			</div>
			<div className='rounded-lg'>
        <UsersRound
          to={"/"}
          className={cn(
            buttonVariants({
              variant: "ghost",
              className: "w-full justify-start text-white hover:bg-zinc-800 hover:text-white",
            })
          )}
        >
          <Bell className='size-5' />
        </UsersRound>
			</div>
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div
            data-testid="avatar-element"
            className={`w-10 rounded-full ${isPending ? "skeleton" : ""}`}
          >
            {!isPending && (
              <img alt="Tailwind CSS Navbar component" src={srcImage} />
            )}
          </div>
        </div>
        <ul
          data-testid="dropdown-element"
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-zinc-100 rounded-md z-[1] mt-3 w-52 p-2 shadow"
        >
          <li>
            <Link
              target="_blank"
              // to={data?.external_urls?.spotify ?? ""}
              to={""}
              className="justify-between hover:bg-zinc-200 rounded-md"
            >
              Account
              <ExternalLink />
            </Link>
          </li>
          <li>
            <button onClick={() => console.log("")} className="hover:bg-zinc-200 rounded-md">
              Profile
            </button>
          </li>
          <li>
            <button onClick={() => console.log("")} className="hover:bg-zinc-200 rounded-md">
              Settings
            </button>
          </li>
          <div className="border-b-2 border-zinc-200 my-1"></div>
          <li>
            <button onClick={handleLogout} className="hover:bg-zinc-200 rounded-md">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AccountBar;
