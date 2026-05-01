"use client";

import { useState } from "react";
import { usePortfolio } from "@/components/PortfolioContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function PortfolioSelector() {
  const { portfolios, activePortfolioId, setActivePortfolioId, isLoading } = usePortfolio();
  const createPortfolio = useMutation(api.portfolios.createPortfolio);
  const deletePortfolio = useMutation(api.portfolios.deletePortfolio);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  if (isLoading) {
    return <div className="h-9 w-[200px] animate-pulse bg-muted rounded-md" />;
  }

  const handleCreate = async () => {
    if (!newPortfolioName.trim()) return;
    try {
      const id = await createPortfolio({ name: newPortfolioName.trim() });
      setActivePortfolioId(id);
      setIsCreateOpen(false);
      setNewPortfolioName("");
      toast.success("Portfolio created successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to create portfolio");
    }
  };

  const handleDelete = async (id: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (portfolios.length <= 1) {
      toast.error("You must have at least one portfolio");
      return;
    }
    setIsDeletingId(id);
  };

  const confirmDelete = async () => {
    if (!isDeletingId) return;
    try {
      await deletePortfolio({ id: isDeletingId as any });
      toast.success("Portfolio deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete portfolio");
    } finally {
      setIsDeletingId(null);
    }
  };

  const isPortfolioValid = portfolios.some(p => p._id === activePortfolioId);

  return (
    <>
      <Select
        value={isPortfolioValid ? activePortfolioId : ""}
        onValueChange={(val) => {
          if (val === "create_new") {
            setIsCreateOpen(true);
          } else {
            setActivePortfolioId(val as any);
          }
        }}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Select Portfolio">
            {portfolios.find(p => p._id === activePortfolioId)?.name || "Select Portfolio"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {portfolios.map((p) => (
            <SelectItem key={p._id} value={p._id} className="flex items-center justify-between">
              <span>{p.name}</span>
              {portfolios.length > 1 && (
                <div 
                  className="ml-auto inline-flex items-center pl-4 cursor-pointer text-muted-foreground hover:text-destructive"
                  onClick={(e) => handleDelete(p._id, e)}
                >
                  <Trash2 className="h-3 w-3 ml-2" />
                </div>
              )}
            </SelectItem>
          ))}
          {portfolios.length < 2 && (
            <>
              <SelectSeparator />
              <SelectItem value="create_new" className="font-medium text-primary">
                <div className="flex items-center">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Portfolio
                </div>
              </SelectItem>
            </>
          )}
        </SelectContent>
      </Select>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Portfolio</DialogTitle>
            <DialogDescription>
              Enter a name for your new portfolio (e.g., Mom's Portfolio).
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newPortfolioName}
            onChange={(e) => setNewPortfolioName(e.target.value)}
            placeholder="Portfolio Name"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newPortfolioName.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!isDeletingId} onOpenChange={(open) => !open && setIsDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Portfolio?</DialogTitle>
            <DialogDescription>
              This will permanently delete the portfolio and all its associated holdings and transactions. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeletingId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
