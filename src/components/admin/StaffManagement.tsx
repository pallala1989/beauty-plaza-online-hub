
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, Plus, Edit, Trash2, Save, X } from "lucide-react";

interface Technician {
  id: string;
  name: string;
  specialties: string[];
  is_available: boolean;
  user_id?: string;
}

const StaffManagement = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTechnician, setNewTechnician] = useState({
    name: '',
    specialties: '',
    is_available: true
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    try {
      const { data, error } = await supabase
        .from('technicians')
        .select('*')
        .order('name');

      if (error) throw error;
      setTechnicians(data || []);
    } catch (error) {
      console.error('Error fetching technicians:', error);
      toast({
        title: "Error",
        description: "Failed to load technicians",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTechnician = async () => {
    if (!newTechnician.name.trim()) return;

    try {
      const specialtiesArray = newTechnician.specialties
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const { data, error } = await supabase
        .from('technicians')
        .insert([{
          name: newTechnician.name,
          specialties: specialtiesArray,
          is_available: newTechnician.is_available
        }])
        .select()
        .single();

      if (error) throw error;

      setTechnicians([...technicians, data]);
      setNewTechnician({ name: '', specialties: '', is_available: true });
      setIsDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Technician added successfully",
      });
    } catch (error) {
      console.error('Error adding technician:', error);
      toast({
        title: "Error",
        description: "Failed to add technician",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTechnician = async (id: string, updates: Partial<Technician>) => {
    try {
      const { data, error } = await supabase
        .from('technicians')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTechnicians(technicians.map(t => t.id === id ? data : t));
      setEditingId(null);
      
      toast({
        title: "Success",
        description: "Technician updated successfully",
      });
    } catch (error) {
      console.error('Error updating technician:', error);
      toast({
        title: "Error",
        description: "Failed to update technician",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTechnician = async (id: string) => {
    if (!confirm('Are you sure you want to delete this technician?')) return;

    try {
      const { error } = await supabase
        .from('technicians')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTechnicians(technicians.filter(t => t.id !== id));
      
      toast({
        title: "Success",
        description: "Technician deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting technician:', error);
      toast({
        title: "Error",
        description: "Failed to delete technician",
        variant: "destructive",
      });
    }
  };

  const handleToggleAvailability = async (id: string, isAvailable: boolean) => {
    await handleUpdateTechnician(id, { is_available: isAvailable });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading staff...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Staff Management
              </CardTitle>
              <CardDescription>
                Manage technicians and staff members
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Technician
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Technician</DialogTitle>
                  <DialogDescription>
                    Add a new technician to your team
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newTechnician.name}
                      onChange={(e) => setNewTechnician({ ...newTechnician, name: e.target.value })}
                      placeholder="Technician name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialties">Specialties</Label>
                    <Input
                      id="specialties"
                      value={newTechnician.specialties}
                      onChange={(e) => setNewTechnician({ ...newTechnician, specialties: e.target.value })}
                      placeholder="Hair Cut, Facial, Massage (comma separated)"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="available"
                      checked={newTechnician.is_available}
                      onCheckedChange={(checked) => setNewTechnician({ ...newTechnician, is_available: checked })}
                    />
                    <Label htmlFor="available">Available for bookings</Label>
                  </div>
                  <Button onClick={handleAddTechnician} className="w-full">
                    Add Technician
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {technicians.map((technician) => (
              <div key={technician.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  {editingId === technician.id ? (
                    <div className="space-y-2">
                      <Input
                        defaultValue={technician.name}
                        placeholder="Name"
                        id={`name-${technician.id}`}
                      />
                      <Input
                        defaultValue={technician.specialties.join(', ')}
                        placeholder="Specialties (comma separated)"
                        id={`specialties-${technician.id}`}
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-medium">{technician.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {technician.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={technician.is_available}
                    onCheckedChange={(checked) => handleToggleAvailability(technician.id, checked)}
                  />
                  
                  {editingId === technician.id ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => {
                          const nameInput = document.getElementById(`name-${technician.id}`) as HTMLInputElement;
                          const specialtiesInput = document.getElementById(`specialties-${technician.id}`) as HTMLInputElement;
                          
                          handleUpdateTechnician(technician.id, {
                            name: nameInput.value,
                            specialties: specialtiesInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0)
                          });
                        }}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(technician.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteTechnician(technician.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
            
            {technicians.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No technicians found. Add your first technician to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffManagement;
