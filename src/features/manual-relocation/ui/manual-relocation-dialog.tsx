import { useState } from 'react';

import type { ApiSchemas } from '@/shared/api/schema';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/kit/alert';
import { Button } from '@/shared/ui/kit/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/kit/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/kit/select';

import {
  ManualRelocationConflictError,
  useManualRelocation,
} from '../api/use-manual-relocation';

type ManualRelocationDialogProps = {
  ghost: ApiSchemas['Ghost'];
  places: ApiSchemas['PlaceWithOccupancy'][];
  relocation: ApiSchemas['Relocation'];
};

export function ManualRelocationDialog({
  ghost,
  places,
  relocation,
}: ManualRelocationDialogProps) {
  const [open, setOpen] = useState(false);
  const [placeId, setPlaceId] = useState(relocation.placeId ?? '');
  const mutation = useManualRelocation();
  const conflict =
    mutation.error instanceof ManualRelocationConflictError
      ? mutation.error
      : undefined;

  const placeSelectId = `place-${ghost.id}`;
  const conflictSelectId = `conflict-${ghost.id}`;

  const placeOptions = places.map((place) => ({
    value: place.id,
    label: `${place.name} — ${place.occupied}/${place.capacity}`,
  }));

  const openChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setPlaceId(relocation.placeId ?? '');
      mutation.reset();
    }
  };
  const close = () => {
    mutation.reset();
    setOpen(false);
  };
  const submit = (force: boolean) => {
    if (!placeId) return;
    mutation.mutate(
      { ghostId: ghost.id, placeId, force },
      { onSuccess: close },
    );
  };

  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogTrigger render={<Button variant='outline' className='w-full' />}>
        Изменить место
      </DialogTrigger>
      <DialogContent showCloseButton={!mutation.isPending}>
        <DialogHeader>
          <DialogTitle>Новое место для {ghost.name}</DialogTitle>
          <DialogDescription>
            Проверим условия перед сохранением решения.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-2'>
          <label className='text-sm font-medium' htmlFor={placeSelectId}>
            Место переселения
          </label>
          <Select
            value={placeId || null}
            items={placeOptions}
            disabled={mutation.isPending}
            onValueChange={(value) => {
              setPlaceId(value ?? '');
              mutation.reset();
            }}
          >
            <SelectTrigger
              id={placeSelectId}
              className='w-full'
              aria-describedby={conflict ? conflictSelectId : undefined}
            >
              <SelectValue placeholder='Выберите место' />
            </SelectTrigger>
            <SelectContent>
              {placeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {conflict && (
          <Alert id={conflictSelectId} variant='destructive'>
            <AlertTitle>Это место не подходит</AlertTitle>
            <AlertDescription>
              <ul className='mt-1 list-disc space-y-1 pl-4'>
                {conflict.issues.map((issue) => (
                  <li key={issue.code}>{issue.message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        {mutation.isError && !conflict && (
          <Alert variant='destructive'>
            <AlertDescription>{mutation.error.message}</AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <Button
            variant='outline'
            disabled={mutation.isPending}
            onClick={close}
          >
            Отмена
          </Button>
          {conflict ? (
            <Button
              variant='destructive'
              disabled={mutation.isPending || !placeId}
              onClick={() => submit(true)}
            >
              Подтвердить несмотря на предупреждения
            </Button>
          ) : (
            <Button
              disabled={mutation.isPending || !placeId}
              onClick={() => submit(false)}
            >
              {mutation.isPending ? 'Проверяем…' : 'Сохранить'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
