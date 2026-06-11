import React, { useState } from 'react';
import { Check, X, AlertCircle, Luggage, Plus, Minus, PlusCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { packingListService } from "@/services/networkService";
import { toast } from 'react-toastify';

interface PackingListItem {
  [key: string]: number;
}

interface PackingListData {
  [category: string]: PackingListItem;
}

interface PackingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  packingList?: PackingListData;
  tripId?: number;
  userId?: string;
  onSave?: (updatedPackingList: PackingListData) => void;
  showSaveButton?: boolean;
}

// Add interface for packed status
interface PackedStatus {
  [category: string]: {
    [item: string]: boolean;
  };
}

// Define valid category types
type CategoryType = "Clothes" | "Footwear" | "Toiletries" | "Miscellaneous" | "Documents" | "Electronics" | "Other";



const categoryColors: Record<CategoryType, string> = {
  "Clothes": "from-purple-500 to-pink-500",
  "Footwear": "from-blue-500 to-cyan-500",
  "Toiletries": "from-green-500 to-emerald-500",
  "Miscellaneous": "from-orange-500 to-red-500",
  "Documents": "from-indigo-500 to-purple-500",
  "Electronics": "from-yellow-500 to-orange-500",
  "Other": "from-gray-500 to-slate-500"
};

const categoryIcons: Record<CategoryType, string> = {
  "Clothes": "👕",
  "Footwear": "👟",
  "Toiletries": "🧴",
  "Miscellaneous": "🎒",
  "Documents": "📄",
  "Electronics": "📱",
  "Other": "📦"
};

const PackingListModal: React.FC<PackingListModalProps> = ({ isOpen, onClose, packingList: propPackingList, tripId, userId, onSave, showSaveButton }) => {
  const [packingList, setPackingList] = useState<PackingListData>(() => {
    return propPackingList || {};
  });
  const [packedStatus, setPackedStatus] = useState<PackedStatus>(() => {
    // Initialize packed status from packing list data
    const initialStatus: PackedStatus = {};
    if (propPackingList) {
      Object.entries(propPackingList).forEach(([category, items]) => {
        initialStatus[category] = {};
        Object.keys(items).forEach(item => {
          initialStatus[category][item] = false; // Default to not packed
        });
      });
    }
    return initialStatus;
  });
  const [newItemName, setNewItemName] = useState("");
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Update packing list when prop changes
  React.useEffect(() => {
    if (propPackingList) {
      setPackingList(propPackingList);
    }
  }, [propPackingList]);

  const getStatusColor = (quantity: number) => {
    if (quantity === 0) return "text-slate-400";
    return "text-emerald-600";
  };

  const getStatusIcon = (quantity: number) => {
    if (quantity === 0) return <AlertCircle className="h-4 w-4 text-slate-400" />;
    return <Check className="h-4 w-4 text-emerald-500" />;
  };

  const getItemBg = (quantity: number) => {
    if (quantity === 0) return "bg-slate-50 border-slate-200";
    return "bg-white border-emerald-100 shadow-sm";
  };

  const updateItemQuantity = (category: string, item: string, delta: number) => {
    setPackingList(prev => {
      const newQuantity = Math.max(0, (prev[category]?.[item] || 0) + delta);

      if (newQuantity === 0) {
        // Remove the item if quantity is 0
        const newCategory = { ...prev[category] };
        delete newCategory[item];

        // If category is empty, remove it too
        if (Object.keys(newCategory).length === 0) {
          const newPackingList = { ...prev };
          delete newPackingList[category];
          return newPackingList;
        }

        return {
          ...prev,
          [category]: newCategory
        };
      }

      return {
        ...prev,
        [category]: {
          ...prev[category],
          [item]: newQuantity
        }
      };
    });
  };

  const addNewItem = (category: string) => {
    if (newItemName.trim()) {
      // Check if item already exists in the category
      if (packingList[category]?.[newItemName.trim()]) {
        toast.warning("This item already exists in this category");
        return;
      }

      setPackingList(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [newItemName.trim()]: 1
        }
      }));
      setNewItemName("");
      setAddingToCategory(null);
      toast.success(`Added ${newItemName.trim()} to ${category}`);
    }
  };

  const removeItem = (category: string, item: string) => {
    setPackingList(prev => {
      const newList = { ...prev };
      if (newList[category]) {
        delete newList[category][item];
        if (Object.keys(newList[category]).length === 0) {
          delete newList[category];
        }
      }
      return newList;
    });

    // Also remove from packed status
    setPackedStatus(prev => {
      const newStatus = { ...prev };
      if (newStatus[category]) {
        delete newStatus[category][item];
        if (Object.keys(newStatus[category]).length === 0) {
          delete newStatus[category];
        }
      }
      return newStatus;
    });
  };

  const handlePackedToggle = (category: string, item: string) => {
    setPackedStatus(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: !prev[category]?.[item]
      }
    }));
  };

  const addNewCategory = () => {
    if (newCategoryName.trim()) {
      // Check if category already exists
      if (packingList[newCategoryName.trim()]) {
        toast.warning("This category already exists");
        return;
      }

      setPackingList(prev => ({
        ...prev,
        [newCategoryName.trim()]: {}
      }));
      setNewCategoryName("");
      setShowAddCategory(false);
      toast.success(`Added new category: ${newCategoryName.trim()}`);
    }
  };

  // Calculate totals
  const totalItems = Object.values(packingList).reduce((total, items) => total + Object.keys(items).length, 0);
  const totalPacked = Object.entries(packedStatus).reduce((total, [category, items]) => {
    return total + Object.values(items).filter(isPacked => isPacked).length;
  }, 0);

  const savePackingList = async () => {
    if (!tripId || !userId) {
      toast.error("Missing trip or user information");
      return;
    }

    setIsSaving(true);
    try {
      // Transform the packing list data to match the backend format
      const sections = Object.entries(packingList).map(([sectionName, items], index) => ({
        name: sectionName,
        order: index,
        items: Object.entries(items).map(([itemName, quantity], itemIndex) => ({
          name: itemName,
          quantity,
          is_packed: packedStatus[sectionName]?.[itemName] ? 1 : 0,
          order: itemIndex
        }))
      }));

      await packingListService.updatePackingList(userId.toString(), tripId.toString(), sections);

      toast.success("Packing list updated successfully!");
      onClose();
      if (onSave) {
        onSave(packingList);
      }
    } catch (error: any) {
      console.error('Error saving packing list:', error);
      toast.error("Failed to update packing list. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Luggage className="h-8 w-8" />
                <div>
                  <h2 className="text-3xl font-bold">Travel Packing List</h2>
                  <p className="text-blue-100 mt-1">
                    {totalItems} categories • {totalPacked} items packed
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200 hover:scale-110"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 bg-gradient-to-br from-slate-50 to-white">
          {/* Add Category Section */}
          <div className="mb-8">
            {showAddCategory ? (
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && addNewCategory()}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                <Button onClick={addNewCategory} size="sm" className="px-6">
                  Add Category
                </Button>
                <Button
                  onClick={() => setShowAddCategory(false)}
                  variant="outline"
                  size="sm"
                  className="px-6"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setShowAddCategory(true)}
                variant="outline"
                className="mb-6 hover:bg-blue-50 border-blue-200 text-blue-700"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add New Category
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {Object.entries(packingList).map(([category, items]) => {
              const packedCount = Object.entries(items).filter(([item]) => packedStatus[category]?.[item]).length;
              const totalCount = Object.keys(items).length;
              const completionPercentage = totalCount === 0 ? 0 : (packedCount / totalCount) * 100;

              // Get category color and icon, with fallback for unknown categories
              const categoryColor = categoryColors[category as CategoryType] || "from-gray-500 to-slate-500";
              const categoryIcon = categoryIcons[category as CategoryType] || "📦";

              return (
                <div
                  key={category}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-200"
                >
                  {/* Category Header */}
                  <div className={`bg-gradient-to-r ${categoryColor} p-4 text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{categoryIcon}</span>
                        <h3 className="text-lg font-bold">{category}</h3>
                      </div>
                      <div className="text-right">
                        <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm font-semibold">
                          {packedCount}/{totalCount}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 bg-white bg-opacity-20 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="p-6 space-y-3">
                    {Object.entries(items).map(([item, quantity]) => (
                      <div
                        key={item}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${getItemBg(quantity)} hover:shadow-sm`}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={packedStatus[category]?.[item] || false}
                            onChange={() => handlePackedToggle(category, item)}
                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                          />
                          {getStatusIcon(quantity)}
                          <span className={`font-medium ${getStatusColor(quantity)} ${packedStatus[category]?.[item] ? 'line-through opacity-60' : ''}`}>
                            {item}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateItemQuantity(category, item, -1)}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className={`font-medium ${getStatusColor(quantity)} w-8 text-center`}>
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateItemQuantity(category, item, 1)}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeItem(category, item)}
                            className="p-2 hover:bg-red-100 rounded-full text-red-500 transition-colors"
                            title="Remove item"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add Item Section */}
                    <div className="mt-6">
                      {addingToCategory === category ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder={`Add item to ${category}`}
                            value={newItemName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItemName(e.target.value)}
                            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && addNewItem(category)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                          />
                          <div className="flex gap-3">
                            <Button onClick={() => addNewItem(category)} size="sm" className="flex-1">
                              Add
                            </Button>
                            <Button
                              onClick={() => setAddingToCategory(null)}
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setAddingToCategory(category)}
                          variant="outline"
                          className="w-full hover:bg-blue-50 border-blue-200 text-blue-700"
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Item to {category}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Footer */}
          <div className="mt-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl p-8 text-white shadow-lg">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Packing Progress</h3>
              <div className="flex justify-center items-center gap-8 text-lg">
                <div className="flex items-center gap-3">
                  <Check className="h-6 w-6" />
                  <span>{totalItems} Categories Ready</span>
                </div>
                <div className="flex items-center gap-3">
                  <Luggage className="h-6 w-6" />
                  <span>{totalPacked} Items Packed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Save Button */}
        {showSaveButton && (
          <div className="p-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-b-2xl flex-shrink-0">
            <div className="text-center">
              <Button
                onClick={savePackingList}
                className="w-full bg-white text-emerald-600 hover:bg-gray-100 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isSaving}
              >
                <Save className="h-5 w-5 mr-3" />
                {isSaving ? "Saving..." : "Save Packing List"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackingListModal;