import { Plus } from 'lucide-react';
import React, { memo } from 'react';

import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';

import { AddNewTaskModel } from './AddNewTaskModel';

const DataTableNewOptions = memo(() => {
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
});

DataTableNewOptions.displayName = 'DataTableNewOptions';

export { DataTableNewOptions };
