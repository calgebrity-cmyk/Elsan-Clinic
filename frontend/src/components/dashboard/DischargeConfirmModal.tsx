import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, AlertTriangle } from "lucide-react";

export function DischargeConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  patientName,
  isPending
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: () => void,
  patientName: string,
  isPending: boolean
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isPending && !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <AlertTriangle className="text-orange-600 h-6 w-6" />
            </div>
            <DialogTitle>Discharge Patient</DialogTitle>
          </div>
          <DialogDescription className="mt-4 pt-2 text-slate-600">
            Are you absolutely sure you want to discharge <span className="font-bold text-slate-800">{patientName}</span>? 
            This action will mark the admission as completed and record the current date and time as the discharge timestamp.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Yes, Discharge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
