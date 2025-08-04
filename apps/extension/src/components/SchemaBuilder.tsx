import React, { useState } from 'react';

interface SchemaField {
  id: string;
  name: string;
}

interface SchemaBuilderProps {
  schema: Record<string, any>;
  onChange: (schema: Record<string, any>) => void;
}

export function SchemaBuilder({ schema, onChange }: SchemaBuilderProps) {
  const [fields, setFields] = useState<SchemaField[]>(() => {
    return Object.keys(schema).map((key, index) => ({
      id: `field-${index}`,
      name: key
    }));
  });
  const [newFieldName, setNewFieldName] = useState('');

  const addField = () => {
    if (!newFieldName.trim()) return;
    
    // Check for duplicate field names
    if (fields.some(field => field.name === newFieldName.trim())) return;

    const newField: SchemaField = {
      id: `field-${Date.now()}`,
      name: newFieldName.trim()
    };
    
    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    setNewFieldName('');
    
    // Update schema
    const newSchema = updatedFields.reduce((acc, field) => {
      acc[field.name] = 'string'; // Default type
      return acc;
    }, {} as Record<string, any>);
    
    onChange(newSchema);
  };

  const removeField = (fieldId: string) => {
    const updatedFields = fields.filter(field => field.id !== fieldId);
    setFields(updatedFields);
    
    // Update schema
    const newSchema = updatedFields.reduce((acc, field) => {
      acc[field.name] = 'string';
      return acc;
    }, {} as Record<string, any>);
    
    onChange(newSchema);
  };

  const updateFieldName = (fieldId: string, newName: string) => {
    if (!newName.trim()) return;
    
    // Check for duplicate field names
    if (fields.some(field => field.id !== fieldId && field.name === newName.trim())) return;

    const updatedFields = fields.map(field => 
      field.id === fieldId ? { ...field, name: newName.trim() } : field
    );
    
    setFields(updatedFields);
    
    // Update schema
    const newSchema = updatedFields.reduce((acc, field) => {
      acc[field.name] = 'string';
      return acc;
    }, {} as Record<string, any>);
    
    onChange(newSchema);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {fields.map((field) => (
          <div key={field.id} className="flex items-center space-x-2">
            <input
              type="text"
              value={field.name}
              onChange={(e) => updateFieldName(field.id, e.target.value)}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
              placeholder="Field name"
            />
            <button
              onClick={() => removeField(field.id)}
              className="text-red-600 hover:text-red-800 px-2 py-1 text-sm"
              type="button"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div className="flex space-x-2">
        <input
          type="text"
          value={newFieldName}
          onChange={(e) => setNewFieldName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addField()}
          className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
          placeholder="New field name"
        />
        <button
          onClick={addField}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          type="button"
        >
          Add Field
        </button>
      </div>
      
      {fields.length === 0 && (
        <p className="text-sm text-gray-500 italic">No fields defined. Add a field to get started.</p>
      )}
    </div>
  );
}