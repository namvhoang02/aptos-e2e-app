'use client';

import { Plus } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';

import { AddNewTaskModel } from './AddNewTaskModel';

export function DataTableNewOptions() {
  return (
    <AddNewTaskModel>
      <DialogTrigger asChild>
        <Button size='sm' className='ml-auto hidden h-8 lg:flex'>
          <Plus className='mr-2 h-4 w-4' />
          New
        </Button>
      </DialogTrigger>
    </AddNewTaskModel>
  );
}
