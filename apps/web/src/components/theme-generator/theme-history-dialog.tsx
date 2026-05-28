import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { toast } from "@workspace/ui/components/sonner";
import {
  Check,
  GitCompareArrows,
  History,
  Pencil,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { ColorMode, ThemeSelection } from "@/lib/theme-generator/types";

type ThemeHistoryDialogProps = {
  mode: ColorMode;
  selection: ThemeSelection;
  onRestore: (snapshot: ThemeHistorySnapshot) => void;
};

export type ThemeHistorySnapshot = {
  id: string;
  name: string;
  mode: ColorMode;
  selection: ThemeSelection;
  createdAt: string;
  updatedAt: string;
};

type ThemeHistoryPayload = {
  version: 1;
  snapshots: Array<ThemeHistorySnapshot>;
};

const THEME_HISTORY_STORAGE_KEY = "radixcn.theme-history";
const MAX_THEME_SNAPSHOTS = 50;

export function ThemeHistoryDialog({
  mode,
  selection,
  onRestore,
}: ThemeHistoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [snapshots, setSnapshots] = useState<Array<ThemeHistorySnapshot>>([]);
  const [snapshotName, setSnapshotName] = useState("");
  const [editingSnapshotId, setEditingSnapshotId] = useState<string | null>(
    null,
  );
  const [editingName, setEditingName] = useState("");

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      setSnapshots(readThemeHistorySnapshots());
      setSnapshotName(getDefaultSnapshotName(selection));
      setEditingSnapshotId(null);
      setEditingName("");
    }
  }

  function saveCurrentSnapshot() {
    const name = normalizeSnapshotName(snapshotName);

    if (!name) {
      toast.error("Add a snapshot name.");
      return;
    }

    const now = new Date().toISOString();
    const nextSnapshot = {
      id: createSnapshotId(),
      name,
      mode,
      selection,
      createdAt: now,
      updatedAt: now,
    } satisfies ThemeHistorySnapshot;
    const nextSnapshots = [nextSnapshot, ...snapshots].slice(
      0,
      MAX_THEME_SNAPSHOTS,
    );

    writeThemeHistorySnapshots(nextSnapshots);
    setSnapshots(nextSnapshots);
    setSnapshotName(getDefaultSnapshotName(selection));
    toast.success("Snapshot saved.");
  }

  function restoreSnapshot(snapshot: ThemeHistorySnapshot) {
    onRestore(snapshot);
    setOpen(false);
    toast.success(`Restored ${snapshot.name}.`);
  }

  function deleteSnapshot(snapshotId: string) {
    const nextSnapshots = snapshots.filter(
      (snapshot) => snapshot.id !== snapshotId,
    );

    writeThemeHistorySnapshots(nextSnapshots);
    setSnapshots(nextSnapshots);
    toast.success("Snapshot deleted.");
  }

  function startRename(snapshot: ThemeHistorySnapshot) {
    setEditingSnapshotId(snapshot.id);
    setEditingName(snapshot.name);
  }

  function saveRename(snapshot: ThemeHistorySnapshot) {
    const name = normalizeSnapshotName(editingName);

    if (!name) {
      toast.error("Add a snapshot name.");
      return;
    }

    const nextSnapshots = snapshots.map((currentSnapshot) =>
      currentSnapshot.id === snapshot.id
        ? {
            ...currentSnapshot,
            name,
            updatedAt: new Date().toISOString(),
          }
        : currentSnapshot,
    );

    writeThemeHistorySnapshots(nextSnapshots);
    setSnapshots(nextSnapshots);
    setEditingSnapshotId(null);
    setEditingName("");
    toast.success("Snapshot renamed.");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" />}>
        <History />
        History
      </DialogTrigger>
      <DialogContent className="grid h-[calc(100svh-2rem)] max-h-[calc(100svh-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden p-0 sm:max-w-3xl lg:h-[min(760px,calc(100svh-2rem))]">
        <DialogHeader className="border-b px-5 pt-5 pb-4">
          <DialogTitle>Theme history</DialogTitle>
          <DialogDescription>
            Save local snapshots, restore previous versions, and compare changes
            before applying them.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto px-5 py-4">
          <div className="grid gap-4">
          <section className="rounded-lg border bg-card p-3">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div className="space-y-2">
                <Label htmlFor="theme-history-name">Snapshot name</Label>
                <Input
                  id="theme-history-name"
                  maxLength={64}
                  value={snapshotName}
                  onChange={(event) => setSnapshotName(event.target.value)}
                />
              </div>
              <Button type="button" onClick={saveCurrentSnapshot}>
                <Save />
                Save snapshot
              </Button>
            </div>
          </section>

          {snapshots.length === 0 ? (
            <div className="grid min-h-52 place-items-center rounded-lg border border-dashed bg-muted/20 px-6 text-center">
              <div className="max-w-sm">
                <History className="mx-auto size-8 text-muted-foreground" />
                <h3 className="mt-3 font-medium">No snapshots yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Save the current theme to create a local restore point.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {snapshots.map((snapshot) => (
                <ThemeHistorySnapshotCard
                  currentSelection={selection}
                  editingName={editingName}
                  editingSnapshotId={editingSnapshotId}
                  key={snapshot.id}
                  snapshot={snapshot}
                  onDelete={deleteSnapshot}
                  onEditingNameChange={setEditingName}
                  onRename={saveRename}
                  onRestore={restoreSnapshot}
                  onStartRename={startRename}
                />
              ))}
            </div>
          )}
          </div>
        </div>

        <DialogFooter className="m-0 shrink-0 rounded-none" showCloseButton />
      </DialogContent>
    </Dialog>
  );
}

function ThemeHistorySnapshotCard({
  currentSelection,
  editingName,
  editingSnapshotId,
  snapshot,
  onDelete,
  onEditingNameChange,
  onRename,
  onRestore,
  onStartRename,
}: ThemeHistorySnapshotCardProps) {
  const diff = useMemo(
    () => summarizeThemeSelectionDiff(currentSelection, snapshot.selection),
    [currentSelection, snapshot.selection],
  );
  const isEditing = editingSnapshotId === snapshot.id;

  return (
    <article className="rounded-lg border bg-card p-3 text-card-foreground">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                aria-label="Snapshot name"
                maxLength={64}
                value={editingName}
                onChange={(event) => onEditingNameChange(event.target.value)}
              />
              <Button
                aria-label="Save snapshot name"
                size="icon"
                type="button"
                onClick={() => onRename(snapshot)}
              >
                <Check />
              </Button>
            </div>
          ) : (
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h3 className="truncate font-medium">{snapshot.name}</h3>
              <Badge variant="outline">{snapshot.mode}</Badge>
            </div>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{formatSnapshotDate(snapshot.createdAt)}</span>
            <span>·</span>
            <span>{diff.count} changed fields</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {diff.labels.length > 0 ? (
              diff.labels.map((label) => (
                <Badge key={label} variant="secondary">
                  <GitCompareArrows />
                  {label}
                </Badge>
              ))
            ) : (
              <Badge variant="success">Matches current theme</Badge>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-2 lg:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onRestore(snapshot)}
          >
            <RotateCcw />
            Restore
          </Button>
          <Button
            aria-label={`Rename ${snapshot.name}`}
            size="icon"
            type="button"
            variant="outline"
            onClick={() => onStartRename(snapshot)}
          >
            <Pencil />
          </Button>
          <Button
            aria-label={`Delete ${snapshot.name}`}
            size="icon"
            type="button"
            variant="destructive"
            onClick={() => onDelete(snapshot.id)}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </article>
  );
}

type ThemeHistorySnapshotCardProps = {
  currentSelection: ThemeSelection;
  editingName: string;
  editingSnapshotId: string | null;
  snapshot: ThemeHistorySnapshot;
  onDelete: (snapshotId: string) => void;
  onEditingNameChange: (name: string) => void;
  onRename: (snapshot: ThemeHistorySnapshot) => void;
  onRestore: (snapshot: ThemeHistorySnapshot) => void;
  onStartRename: (snapshot: ThemeHistorySnapshot) => void;
};

function readThemeHistorySnapshots() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const payload = JSON.parse(
      window.localStorage.getItem(THEME_HISTORY_STORAGE_KEY) ?? "",
    ) as ThemeHistoryPayload;

    if (payload.version !== 1 || !Array.isArray(payload.snapshots)) {
      return [];
    }

    return payload.snapshots.filter(isThemeHistorySnapshot);
  } catch {
    return [];
  }
}

function writeThemeHistorySnapshots(snapshots: Array<ThemeHistorySnapshot>) {
  window.localStorage.setItem(
    THEME_HISTORY_STORAGE_KEY,
    JSON.stringify({
      version: 1,
      snapshots,
    } satisfies ThemeHistoryPayload),
  );
}

function isThemeHistorySnapshot(
  value: unknown,
): value is ThemeHistorySnapshot {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const snapshot = value as Partial<ThemeHistorySnapshot>;

  return (
    typeof snapshot.id === "string" &&
    typeof snapshot.name === "string" &&
    (snapshot.mode === "light" || snapshot.mode === "dark") &&
    Boolean(snapshot.selection) &&
    typeof snapshot.createdAt === "string" &&
    typeof snapshot.updatedAt === "string"
  );
}

function summarizeThemeSelectionDiff(
  currentSelection: ThemeSelection,
  snapshotSelection: ThemeSelection,
) {
  const labels = new Set<string>();
  let count = 0;

  for (const key of Object.keys(currentSelection) as Array<keyof ThemeSelection>) {
    if (!areSelectionValuesEqual(currentSelection[key], snapshotSelection[key])) {
      count += 1;
      labels.add(getDiffLabel(key));
    }
  }

  return {
    count,
    labels: Array.from(labels).slice(0, 6),
  };
}

function areSelectionValuesEqual(value: unknown, otherValue: unknown) {
  return JSON.stringify(value) === JSON.stringify(otherValue);
}

function getDiffLabel(key: keyof ThemeSelection) {
  if (key.includes("Scale") || key.includes("Color")) {
    return "Color";
  }

  if (key.includes("Font") || key === "trackingNormal") {
    return "Typography";
  }

  if (key.includes("Chart")) {
    return "Charts";
  }

  if (key.includes("token")) {
    return "Tokens";
  }

  if (key.includes("shadow") || key.includes("radius") || key === "spacing") {
    return "Shape";
  }

  return "Settings";
}

function getDefaultSnapshotName(selection: ThemeSelection) {
  const now = new Date();
  const date = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(now);

  return `${selection.name || "Theme"} · ${date}`;
}

function normalizeSnapshotName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

function createSnapshotId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatSnapshotDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
