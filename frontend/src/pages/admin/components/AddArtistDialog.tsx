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
import { useMusicStore } from "@/stores/useMusicStore";
import { isEmpty } from "lodash";
import { Pencil, Plus, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface NewArtist {
  name: string;
  email: string;
  password: string;
  bio: string;
}

const AddArtistDialog = (props) => {
  const { isEdit = false, data = {} } = props;
  const { addArtist, artists = [], editArtist, fetchArtists } = useMusicStore();
  const [artistDialogOpen, setArtistDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newArtist, setNewArtist] = useState<NewArtist>({
    name: "",
    bio: "",
    email: "",
    password: "",
  });

  const [files, setFiles] = useState<{
    image: File | null;
    previewUrl: string | null;
  }>({
    image: null,
    previewUrl: null,
  });

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (!isEdit && !files.image) {
        return toast.error("Please upload image files");
      }
      if (!newArtist.name || !newArtist.email) {
        return toast.error("Please fill all required fields");
      }
      if (!isEdit && !newArtist.password) {
        return toast.error("Please fill all required fields");
      }

      const formData = new FormData();

      formData.append("name", newArtist.name);
      formData.append("bio", newArtist.bio);
      formData.append("email", newArtist.email);
      if (!isEmpty(newArtist.password)) formData.append("password", newArtist.password)
        else formData.append("password", "111111");
      if (files.image) formData.append("image_url", files.image);

      if (isEdit) {
        await editArtist(data._id, formData);
      } else {
        await addArtist(formData);
      }

      setNewArtist({
        name: "",
        bio: "",
        email: "",
        password: "",
      });

      setFiles({
        image: null,
        previewUrl: null,
      });
      setArtistDialogOpen(false);
      fetchArtists();
    } catch (error: any) {
      toast.error("Failed to add artist: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (artistDialogOpen) {
      if (isEdit) {
        setNewArtist({
          name: data?.name || "",
          bio: data?.bio || "",
          email: data?.email || "",
          password: data?.password || "",
        });
        setFiles({
          image: null,
          previewUrl: data?.image_url || null,
        });
      }
    }
  }, [artistDialogOpen]);

  return (
    <Dialog open={artistDialogOpen} onOpenChange={setArtistDialogOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-black">
            <Plus className="mr-2 h-4 w-4" />
            Add Artist
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto text-zinc-400">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Artist" : "Add New Artist"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update artist details"
              : "Add a new artist to your music library"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <input
            type="file"
            ref={imageInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) =>
              setFiles((prev) => ({
                ...prev,
                image: e.target.files![0],
                previewUrl: URL.createObjectURL(e.target.files![0]),
              }))
            }
          />

          {/* image upload area */}
          <div
            className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
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
                <div className="text-sm text-zinc-400 mb-2">Upload artwork</div>
              </>
            )}
          </div>

          {/* other fields */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={newArtist.name}
              onChange={(e) =>
                setNewArtist({ ...newArtist, name: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              value={newArtist.email}
              onChange={(e) =>
                setNewArtist({ ...newArtist, email: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              value={newArtist.password}
              onChange={(e) =>
                setNewArtist({ ...newArtist, password: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <Input
              value={newArtist.bio}
              onChange={(e) =>
                setNewArtist({ ...newArtist, bio: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setArtistDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Uploading..." : isEdit ? "Update Artist" : "Add Artist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddArtistDialog;
