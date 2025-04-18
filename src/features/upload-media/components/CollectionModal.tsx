import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import {
  AddCircle,
  CheckCircleOutline,
  Close,
  Search,
} from "@mui/icons-material";

interface Collection {
  id: number;
  name: string;
  projects: number;
  image: string;
}

interface CollectionModalProps {
  open: boolean;
  onClose: () => void;
}

const CollectionModal: React.FC<CollectionModalProps> = ({ open, onClose }) => {
  const [search, setSearch] = useState<string>("");
  const [selectedCollection, setSelectedCollection] = useState<number | null>(
    null
  );
  const collections: Collection[] = [
    {
      id: 0,
      name: "Favourite Collection",
      projects: 1,
      image: "https://via.placeholder.com/40",
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <div className="dark:bg-mountain-900 dark:text-white flex justify-between items-center">
        <DialogTitle className="text-2xl">
          Add art project to collection
        </DialogTitle>
        <IconButton onClick={onClose} className="dark:text-white">
          <Close />
        </IconButton>
      </div>
      <DialogContent className="p-4  dark:text-white">
        <Button
          variant="contained"
          className=" !bg-transparent !border-1 dark:!border-gray-500 dark:text-white flex items-center gap-2 normal-case"
        >
          <AddCircle className="!text-blue-400" /> Create new collection
        </Button>
        <div className="relative mt-4">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search collections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="dark:bg-mountain-800 dark:!text-white rounded-md"
            InputProps={{
              startAdornment: <Search className="text-white mx-2" />,
              style: { color: "white" },
            }}
          />
        </div>
        <div className="space-y-3 mt-4">
          {collections
            .filter((col) =>
              col.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((col) => (
              <div
                key={col.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                  selectedCollection === col.id
                    ? "bg-blue-500"
                    : "dark:bg-mountain-800"
                }`}
                onClick={() => setSelectedCollection(col.id)}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={col.image}
                    alt={col.name}
                    className="w-12 h-12 rounded-lg"
                  />
                  <div>
                    <p className="font-medium dark:text-white">{col.name}</p>
                    <p className="text-sm dark:text-gray-400">
                      {col.projects} Project{col.projects > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                {selectedCollection === col.id && (
                  <CheckCircleOutline className="dark:text-white" />
                )}
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionModal;
