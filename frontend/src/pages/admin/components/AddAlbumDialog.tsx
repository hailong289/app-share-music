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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMusicStore } from "@/stores/useMusicStore";
import { Pencil, Plus, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ChevronDownIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const AddAlbumDialog = (props) => {
  const { isEdit = false, data = {} } = props;
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { addAlbum, artists, editAlbum, fetchAlbums } = useMusicStore();

  const [newAlbum, setNewAlbum] = useState({
    title: "",
    artist: "",
    releaseDate: new Date(),
  });

  const [files, setFiles] = useState<{
    image: File | null;
    previewUrl: string | null;
  }>({
    image: null,
    previewUrl: null,
  });

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (!files) {
        return toast.error("Please upload an image");
      }
      if (!newAlbum.artist || !newAlbum.title || !newAlbum.releaseDate) {
        return toast.error("Please fill all required fields");
      }
      const formData = new FormData();
      formData.append("title", newAlbum.title);
      formData.append("artist_id", newAlbum.artist);
      formData.append("release_date", newAlbum.releaseDate.toString());
      if (files.image) formData.append("cover_url", files.image);

      if (isEdit) {
        await editAlbum(data._id, formData);
      } else {
        await addAlbum(formData);
      }

      setNewAlbum({
        title: "",
        artist: "",
        releaseDate: new Date(),
      });
      setFiles({
        image: null,
        previewUrl: null,
      });
      setAlbumDialogOpen(false);
    } catch (error: any) {
      toast.error("Failed to create album: " + error.message);
    } finally {
      setIsLoading(false);
      fetchAlbums({})
    }
  };

  useEffect(() => {
    if (albumDialogOpen && isEdit && data) {
      setNewAlbum({
        title: data.title || "",
        artist: data.artist?._id || "",
        releaseDate: data.release_date ? new Date(data.release_date) : new Date(),
      });
      setFiles({
        image: null,
        previewUrl: data.cover_url || null,
      });
    }
  }, [albumDialogOpen]);

  return (
    <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
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
          <Button className="bg-violet-500 hover:bg-violet-600 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Album
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-zinc-400">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Album" : "Add New Album"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update album details" : "Add a new album to your collection"}
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Album Title</label>
            <Input
              value={newAlbum.title}
              onChange={(e) =>
                setNewAlbum({ ...newAlbum, title: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
              placeholder="Enter album title"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Artist (Optional)</label>
            <Select
              value={newAlbum.artist}
              onValueChange={(value) =>
                setNewAlbum({ ...newAlbum, artist: value })
              }
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-400">
                <SelectValue placeholder="Select artist" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-400">
                {artists.map((artist) => (
                  <SelectItem key={artist._id} value={artist._id}>
                    {artist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Release Date</label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild className="w-full">
                <Button
                  variant="outline"
                  id="date"
                  className="w-full bg-zinc-800 border-zinc-700"
                >
                  {newAlbum.releaseDate
                    ? newAlbum.releaseDate.toLocaleDateString()
                    : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0 bg-zinc-800 border-zinc-700"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={newAlbum.releaseDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setNewAlbum({
                      ...newAlbum,
                      releaseDate: date || new Date(),
                    });
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setAlbumDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-violet-500 hover:bg-violet-600"
            disabled={
              isLoading || !files || !newAlbum.title || !newAlbum.artist
            }
          >
            {isLoading ? "Creating..." : isEdit ? "Edit Album" : "Add Album"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddAlbumDialog;
