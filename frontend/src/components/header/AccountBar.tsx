import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { Bell, ExternalLink, Upload, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

const AccountBar = (props: any) => {
  const { color = '', type = 'homePage' } = props;
  const { logout, user, updateProfile } = useAuthStore();
  const [form, setForm] = useState<any>({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    image_url: user?.image_url || '',
  });

  const handleLogout = () => {
    logout();
    window.location.reload();
  };
  const isPending = false;

  const openModel = () => {
    const dialog: any = document.getElementById('update_profile');
    if (dialog) {
      dialog.showModal();
    }
  }

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(form);
      const dialog: any = document.getElementById('update_profile');
      if (dialog) {
        dialog.close();
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Cập nhật thông tin thất bại. Vui lòng thử lại.");
    }
  }

  const closeModal = () => {
    const dialog: any = document.getElementById('update_profile');
    if (dialog) {
      dialog.close();
    }
  }

  return (
    <div
      className={"flex-none flex flex-row gap-2 items-center justify-center" + " " + color}
    >
      {
        type === 'homePage' && (
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
        )
      }
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
              <img alt="Tailwind CSS Navbar component" src={user?.image_url} crossOrigin={user?.image_url.includes("uploads") ? "anonymous" : undefined} />
            )}
          </div>
        </div>
        <ul
          data-testid="dropdown-element"
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-zinc-100 rounded-md z-[1] mt-3 w-52 p-2 shadow"
        >
          <li>
            <button
              // to={data?.external_urls?.spotify ?? ""}
              className="justify-between hover:bg-zinc-200 rounded-md"
              onClick={openModel}
            >
              Account
              <ExternalLink size={15} />
            </button>
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
      <dialog id="update_profile" className="modal">
        <div className="modal-box bg-black text-white rounded-md">
          <h3 className="text-lg font-bold">Cập nhật thông tin tài khoản</h3>
          <div className="modal-content flex flex-col items-center">
            <div className="mt-10 mb-2 position-relative">
              <div className="avatar">
                <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring-2 ring-offset-2">
                  {typeof form?.image_url === 'string' ? (
                    <img src={form?.image_url || user?.image_url || 'https://placehold.co/600x400/png'} alt="Avatar" crossOrigin={user?.image_url.includes("uploads") ? "anonymous" : undefined} />
                  ) : (
                    form?.image_url && (
                      <img src={URL.createObjectURL(form?.image_url)} alt="Avatar" crossOrigin={form?.image_url.includes("uploads") ? "anonymous" : undefined} />
                    )
                  )}
                </div>
                <div className="absolute -bottom-0 -right-0">
                  <label htmlFor="image_url" className="cursor-pointer">
                    <div className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2">
                      <Upload size={15} />
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <p className="text-zinc-200">Trạng thái: {user?.isActive ? "Đã xác thực" : "Chưa xác thực"}</p>
            <p className="mb-10 text-zinc-200">Tham gia ngày: {new Date(user?.createdAt || '').toLocaleDateString()}</p>

            <div className="w-full">
              <label htmlFor="">Họ và tên</label>
              <Input
                defaultValue={form?.name}
                className="bg-zinc-800 text-white mt-4" onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="w-full mt-4">
              <label htmlFor="">Email</label>
              <Input
                defaultValue={form?.email}
                className="bg-zinc-800 text-white mt-4" readOnly />
            </div>

            <div className="w-full mt-4">
              <label htmlFor="">Bio</label>
              <textarea rows={5} defaultValue={form?.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="bg-zinc-800 text-white mt-4 w-full rounded-md border border-input px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />
            </div>

            {user?.role === 'artist' && (
              <div className="w-full mt-4">
                <label htmlFor="">Số người theo dõi</label>
                <Input disabled defaultValue={user?.total_followers} className="bg-zinc-800 text-white mt-4" />
              </div>
            )}

            <div className="w-full mt-4">
              <Input
                id="image_url"
                type="file"
                className="bg-zinc-800 text-white mt-4 hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    setForm({ ...form, image_url: e.target.files[0] });
                  }
                }}
                />
            </div>


          </div>
          <div className="modal-action">
            <button className="btn btn-primary rounded-md" onClick={handleUpdateProfile}>Lưu</button>
            <button className="btn rounded-md" onClick={closeModal}>Thoát</button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AccountBar;
