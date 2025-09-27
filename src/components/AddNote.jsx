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
import { Loader2, Plus } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

// dialog for adding note
function AddNote({
  onNoteAdded
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const closeDialog = useRef(null);

  const handleAddNote = async (e) => {
    e.preventDefault();
    setLoading(true);

    axios.post('/api/notes',{
        title,
        content
    })
    .then(({data}) => {
        if(data.success) {
            setTitle('');
            setContent('');
            closeDialog.current?.click();
            onNoteAdded();
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
            className="px-4 py-5 text-lg shadow-md bg-black text-white cursor-pointer"
          >
            add note{' '}<Plus/>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddNote} className='space-y-4'>
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
                        onClick={() => {
                          setTitle('');
                          setContent('');
                        }}
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
                ) : "Add"}
                </Button>
            </DialogFooter>
          </form>
        </DialogContent>
    </Dialog>
  )
}

export default AddNote;
