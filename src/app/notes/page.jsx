"use client";

import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Loader2, XIcon } from 'lucide-react';

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import axios from 'axios';
import toast from 'react-hot-toast';
import AddNote from '@/components/AddNote';
import EditNote from '@/components/EditNote';

function page() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletinNoteId, setDeletingNoteId] = useState(null);

  const fetchNotes = () => {
    setLoading(true);

    axios.get('/api/notes')
    .then(({data}) => {
      if(data.success) {
        if(data.data?.length > 0){
          setNotes(data.data);
        }
        toast.success("Notes fetched successfully");
      }
    })
    .catch(({response}) => {
      const errorMessage = response.data.message;
      toast.error(errorMessage);
    })
    .finally(() => setLoading(false));
  }

  const handleDelete = (id) => {
    setDeletingNoteId(id);
    
    axios.delete(`/api/notes/${id}`)
    .then(({data}) => {
      if(data.success) {
        toast.success(data.message);
        setNotes(prev => prev.filter(note => note._id !== id));
        fetchNotes();
      }
    })
    .catch(({response}) => {
      const errorMessage = response.data.message;
      toast.error(errorMessage);
    })
    .finally(() => setDeletingNoteId(null));
  }

  useEffect(() => {
    fetchNotes();
  },[])

  if(loading) {
    return (
      <div className='w-full h-full p-5'>
        <Loader2 className='animate-spin mx-auto mt-10'/>
      </div>
    )
  }

  return (
    <div className='w-full h-full p-5'>
      <div className="w-full max-w-xl mx-auto mt-5 space-y-5">
          <div className=' flex items-center gap-5 flex-wrap'>
            <span className='text-3xl font-bold'>Notes</span>
            <AddNote onNoteAdded={fetchNotes}/>
          </div>
          <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-3'>
            {notes.length <= 0 ? (
              <p className=''>Notes not available</p>
            ) : (notes.map((note) => (
                  <Card className="bg-amber-400 border-none" key={note._id}>
                    <CardHeader className="flex items-center justify-between">
                      <CardTitle>{note.title}</CardTitle>
                      <CardAction className="space-x-2">
                        <EditNote 
                          id={note._id} 
                          prevTitle={note.title} 
                          prevContent={note.content} 
                          onNoteEditted={fetchNotes}
                        />
                        <Button
                          onClick={() => handleDelete(note._id)}
                          className="bg-black cursor-pointer"
                        >
                          {deletinNoteId === note._id ? (
                            <Loader2 className='animate-spin' color='white' />
                          ) : (
                            <XIcon color="white"/>
                          )}
                        </Button>
                      </CardAction>
                    </CardHeader>
                    <CardContent>
                      {note.content}
                    </CardContent>
                  </Card>
            )))}
          </div>
      </div>
    </div>
  )
}

export default page
