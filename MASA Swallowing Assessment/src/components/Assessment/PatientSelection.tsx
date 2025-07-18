import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { EnhancedPatientService } from '../../services/EnhancedPatientService';
import { Patient } from '../../types/Patient';

interface PatientSelectionProps {
  open: boolean;
  onClose: () => void;
  onPatientSelected: (patient: Patient) => void;
}

const PatientSelection: React.FC<PatientSelectionProps> = ({
  open,
  onClose,
  onPatientSelected,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    name: '',
    dateOfBirth: '',
    mrn: '',
  });

  useEffect(() => {
    if (open) {
      loadPatients();
    }
  }, [open]);

  const loadPatients = async () => {
    try {
      const allPatients = await EnhancedPatientService.getAllPatients();
      setPatients(allPatients);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.mrn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePatient = async () => {
    if (newPatientData.name && newPatientData.dateOfBirth) {
      try {
        const newPatient = await EnhancedPatientService.createPatient(newPatientData);
        setNewPatientData({ name: '', dateOfBirth: '', mrn: '' });
        setShowNewPatientForm(false);
        loadPatients();
        setSelectedPatientId(newPatient.id);
      } catch (error) {
        console.error('Error creating patient:', error);
      }
    }
  };

  const handleConfirmSelection = () => {
    const selectedPatient = patients.find(p => p.id === selectedPatientId);
    if (selectedPatient) {
      onPatientSelected(selectedPatient);
      onClose();
      setSelectedPatientId('');
      setSearchTerm('');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Select Patient</Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setShowNewPatientForm(true)}
            size="small"
          >
            New Patient
          </Button>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {showNewPatientForm ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Add New Patient
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Patient Name *"
              fullWidth
              variant="outlined"
              value={newPatientData.name}
              onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Date of Birth *"
              type="date"
              fullWidth
              variant="outlined"
              value={newPatientData.dateOfBirth}
              onChange={(e) => setNewPatientData({ ...newPatientData, dateOfBirth: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Medical Record Number (MRN)"
              fullWidth
              variant="outlined"
              value={newPatientData.mrn}
              onChange={(e) => setNewPatientData({ ...newPatientData, mrn: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleCreatePatient}
                disabled={!newPatientData.name || !newPatientData.dateOfBirth}
              >
                Create Patient
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowNewPatientForm(false)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search patients by name or MRN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ mb: 2 }}
            />

            {filteredPatients.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {searchTerm ? 'No patients found matching your search.' : 'No patients found.'}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowNewPatientForm(true)}
                >
                  Add First Patient
                </Button>
              </Box>
            ) : (
              <List>
                {filteredPatients.map((patient, index) => (
                  <React.Fragment key={patient.id}>
                    <ListItem
                      button
                      selected={selectedPatientId === patient.id}
                      onClick={() => setSelectedPatientId(patient.id)}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        '&.Mui-selected': {
                          bgcolor: 'primary.light',
                          '&:hover': {
                            bgcolor: 'primary.light',
                          },
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {getInitials(patient.name)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={patient.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              MRN: {patient.mrn || 'Not specified'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              DOB: {formatDate(patient.dateOfBirth)}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        {selectedPatientId === patient.id && (
                          <Chip label="Selected" color="primary" size="small" />
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < filteredPatients.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {!showNewPatientForm && (
          <Button
            onClick={handleConfirmSelection}
            variant="contained"
            disabled={!selectedPatientId}
          >
            Select Patient
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PatientSelection; 