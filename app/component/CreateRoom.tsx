"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateRoom() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create the room");
      }
      const room = await response.json();
      router.refresh();
      setOpen(false);
      router.push(`/rooms/${room.slug}`);
    } catch (error) {
      console.error("Error creating the room", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-slate-200 flex justify-center my-10 text-black px-5 py-4 rounded-xl mx-auto">
        Create Room
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new room:</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Room Title:</Label>
            <Input
              className="border border-black"
              id="name"
              name="name"
              required
            ></Input>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              className="border border-black"
              id="description"
              name="description"
            ></Textarea>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create room"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
