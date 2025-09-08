import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { PencilLineIcon, Plus, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface NewPlaylist {
  name: string;
  description: string;
}

const EditPlaylistDialog = (props) => {
  const { playlistId } = props;
  const { editPlaylist, currentAlbum: data, fetchPlaylistById, fetchPlayList } = useMusicStore();
  const { user } = useAuthStore();
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [newPlaylist, setNewPlaylist] = useState<NewPlaylist>({
    name: "",
    description: "",
  });

  const [files, setFiles] = useState<{
    image: File | null;
  }>({
    image: null,
  });

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!user) {
      navigate("/login");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      if (newPlaylist.name.trim() === "" || newPlaylist.description.trim() === "") {
        return toast.error("Please fill in all the data");
      }

      if (files.image != null) {
        formData.append("banner_url", files.image);
      } else {
        formData.delete("banner_url");
      }
      formData.append("name", newPlaylist.name);
      formData.append("description", newPlaylist.description);

      await editPlaylist(playlistId, formData);

      setNewPlaylist({
        name: "",
        description: "",
      });

      setFiles({
        image: null,
      });
    } catch (error: any) {
      toast.error("Failed to edit playlist: " + error.message);
    } finally {
      fetchPlaylistById(playlistId);
      fetchPlayList();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (playlistDialogOpen && playlistId) {
      setNewPlaylist({
        name: data?.name || "",
        description: data?.description || "",
      });
      setFiles({
        image: null,
        previewUrl: data?.banner_url || null,
      });
    }
  }, [playlistDialogOpen, playlistId]);

  return (
    <Dialog open={playlistDialogOpen} onOpenChange={setPlaylistDialogOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="w-14 h-14 rounded-full bg-yellow-500 hover:bg-yellow-400
          hover:scale-105 transition-all"
        >
          <PencilLineIcon className="h-7 w-7 text-white" />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto text-zinc-400">
        <DialogHeader>
          <DialogTitle>Edit New Playlist</DialogTitle>
          <DialogDescription>
            Edit a new playlist to your music library
          </DialogDescription>
        </DialogHeader>
        {user ? (
          <div className="space-y-4 py-4">
            <input
              type="file"
              ref={imageInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                setFiles((prev) => ({ ...prev, image: e.target.files![0], previewUrl: URL.createObjectURL(e.target.files![0]) }))
              }
            />

            {/* image upload area */}
            <div
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
              onClick={() => imageInputRef.current?.click()}
            >
              {files.previewUrl ? (
                <div className="space-y-2 text-center">
                  <img
                    crossOrigin="anonymous"
                    src={files.previewUrl}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded-md mx-auto"
                  />
                  <div className="text-xs text-zinc-400 mt-2">
                    {files.image
                      ? files.image.name.slice(0, 20)
                      : "Current Image"}
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                    <Upload className="h-6 w-6 text-zinc-400" />
                  </div>
                  <div className="text-sm text-zinc-400 mb-2">
                    Upload artwork
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    Choose File
                  </Button>
                </>
              )}
            </div>

            {/* other fields */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={newPlaylist.name}
                onChange={(e) =>
                  setNewPlaylist({ ...newPlaylist, name: e.target.value })
                }
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={newPlaylist.description}
                onChange={(e) =>
                  setNewPlaylist({
                    ...newPlaylist,
                    description: e.target.value,
                  })
                }
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">Log in to create playlists.</div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setPlaylistDialogOpen(false)}
            disabled={isLoading}
          >
            {user ? "Cancel" : "Not now"}
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {user ? (isLoading ? "Uploading..." : "Edit Playlist") : "Log in"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default EditPlaylistDialog;
