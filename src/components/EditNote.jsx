"use client";

import React, { useRef, useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogDescription
} from "@/components/ui/dialog";  
import { Loader2, PencilIcon } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

// dialog for editing note
function EditNote({
  id,
  onNoteEditted,
  prevTitle,
  prevContent
}) {
  const [title, setTitle] = useState(prevTitle);
  const [content, setContent] = useState(prevContent);
  const [loading, setLoading] = useState(false);

  const closeDialog = useRef(null);

  const handleEditNote = async (e) => {
    e.preventDefault();
    setLoading(true);

    axios.put(`/api/notes/${id}`,{
        title,
        content
    })
    .then(({data}) => {
        if(data.success) {
            setTitle('');
            setContent('');
            closeDialog.current?.click();
            onNoteEditted();
            toast.success(data.message);
        }
    })
    .catch(({response}) => {
        const errorMessage = response.data.message;
        toast.error(errorMessage);
    })
    .finally(() => setLoading(false));
  }

  return (
    <Dialog>
        <DialogTrigger asChild>
          <Button
            className="bg-black cursor-pointer"
          >
            <PencilIcon color="white"/>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditNote} className='space-y-4'>
            <div className="grid gap-4">
                <div className="grid gap-3">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                </div>
                <div className="grid gap-3">
                <Label htmlFor="content">Content</Label>
                <Input 
                    id="content"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button
                        ref={closeDialog}
                        className="px-4 py-5 text-lg shadow-md bg-black text-white cursor-pointer"
                    >
                        Cancel
                    </Button>
                </DialogClose>
                <Button
                    type="submit"
                    className="px-4 py-5 text-lg shadow-md bg-black text-white cursor-pointer"
                >
                    {loading ? (
                    <>
                    <Loader2 className='animate-spin' />{' '}
                    Loading
                    </>
                ) : "Update"}
                </Button>
            </DialogFooter>
          </form>
        </DialogContent>
    </Dialog>
  )
}

export default EditNote;
