'use client'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AddUserToRoomProps {
    roomId : string
}

export default function AddNewUserToRoom({roomId} : AddUserToRoomProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
        const formData = new FormData(e.currentTarget)
        const res = await fetch(`/api/rooms/${roomId}/members`,{
            method : 'POST',
            headers : {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                username : formData.get('username')
            })
        })

        if (!res.ok) {
            throw new Error("Unable to add user to the room")
        }
        const data = await res.json()
        router.refresh()
        setOpen(false)
    } catch (error : any) {
        console.error("Unable to add user to the room",error)
        if (error.status === 400 ) {
            alert("User is not registered on leet-rank. Please enter the correct username!")
        }
    } finally {
        setLoading(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-white hover:bg-blue-600 hover:text-white px-5 py-2 text-black rounded-xl">Add User</DialogTrigger>
      <DialogContent>
        <DialogTitle>Add New User to Room</DialogTitle>
        <DialogDescription>Add the username of the user you want to add in the room!</DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-4" >
            <div>
                <Label>Username</Label>
                <Input id="username" name="username" required />
            </div>
            <Button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Add User"}
            </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
