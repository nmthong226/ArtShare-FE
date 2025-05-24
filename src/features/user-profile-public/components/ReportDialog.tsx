// src/components/ReportDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  submitting?: boolean;
}

const ReportDialog: React.FC<ReportDialogProps> = ({
  open,
  onClose,
  onSubmit,
  submitting = false,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setReason('');
      setError('');
    }
  }, [open]);

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Please enter a reason.');
      return;
    }
    onSubmit(reason.trim());
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Report</DialogTitle>
      <DialogContent dividers>
        <TextField
          autoFocus
          multiline
          minRows={3}
          fullWidth
          label="Reason for reporting"
          placeholder="Describe why you are reporting this"
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (error) setError('');
          }}
          disabled={submitting}
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={submitting}
        >
          {submitting ? 'Reporting…' : 'Report'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDialog;