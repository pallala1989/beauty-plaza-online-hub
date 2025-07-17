import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/useSettings";
import { Settings, Plus, Edit, Trash2, Save } from "lucide-react";

const SettingsManagement = () => {
  const { settings, updateSetting } = useSettings();
  const { toast } = useToast();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newSetting, setNewSetting] = useState({ key: '', value: '', description: '' });

  const handleUpdateSetting = async (key: string, value: any) => {
    try {
      await updateSetting(key, value);
      setEditingKey(null);
      toast({
        title: "Setting Updated",
        description: `${key} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update setting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddSetting = async () => {
    if (!newSetting.key) return;
    
    try {
      let value = newSetting.value;
      // Try to parse as JSON if it looks like an object/array
      if (newSetting.value.startsWith('{') || newSetting.value.startsWith('[')) {
        try {
          value = JSON.parse(newSetting.value);
        } catch {
          // Keep as string if not valid JSON
        }
      }
      
      await updateSetting(newSetting.key, value);
      setNewSetting({ key: '', value: '', description: '' });
      toast({
        title: "Setting Added",
        description: `${newSetting.key} has been added successfully.`,
      });
    } catch (error) {
      toast({
        title: "Add Failed",
        description: "Failed to add setting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderSettingValue = (key: string, value: any) => {
    if (typeof value === 'boolean') {
      return (
        <Switch
          checked={value}
          onCheckedChange={(checked) => handleUpdateSetting(key, checked)}
        />
      );
    }
    
    if (typeof value === 'object') {
      return (
        <Badge variant="outline" className="font-mono">
          {JSON.stringify(value, null, 2)}
        </Badge>
      );
    }
    
    return (
      <div className="flex items-center space-x-2">
        {editingKey === key ? (
          <>
            <Input
              defaultValue={value}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleUpdateSetting(key, (e.target as HTMLInputElement).value);
                }
              }}
              className="flex-1"
            />
            <Button
              size="sm"
              onClick={() => {
                const input = document.querySelector(`input[defaultValue="${value}"]`) as HTMLInputElement;
                if (input) handleUpdateSetting(key, input.value);
              }}
            >
              <Save className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <span className="flex-1">{value}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditingKey(key)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    );
  };

  const commonSettings = settings ? Object.entries(settings).filter(([key]) => 
    ['contact_phone', 'contact_email', 'in_home_fee', 'loyalty_settings', 'referral_amounts'].includes(key)
  ) : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Settings Management
          </CardTitle>
          <CardDescription>
            Manage application settings and configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commonSettings.map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="font-medium">{key.replace(/_/g, ' ').toUpperCase()}</Label>
                  <p className="text-sm text-gray-500">System setting</p>
                </div>
                <div className="w-1/2">
                  {renderSettingValue(key, value)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Setting</CardTitle>
          <CardDescription>
            Add custom application settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="setting-key">Setting Key</Label>
              <Input
                id="setting-key"
                placeholder="e.g., custom_feature_enabled"
                value={newSetting.key}
                onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="setting-value">Value</Label>
              <Input
                id="setting-value"
                placeholder="true, 25, or JSON object"
                value={newSetting.value}
                onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddSetting} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Setting
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsManagement;
