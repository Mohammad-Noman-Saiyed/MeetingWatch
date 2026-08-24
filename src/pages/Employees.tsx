import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";

type Employee = {
  id: number;
  name: string;
  wage_amount: string;
  wage_type: "hourly" | "yearly";
};

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:4000/api/employees", {
        credentials: "include",
      });
      if (!response.ok) {
        setError("Could not load employees");
        return;
      }
      const data = await response.json();
      setEmployees(data);
    } catch {
      setError("Could not reach the server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Add-new-employee form state
  const [newName, setNewName] = useState("");
  const [newWage, setNewWage] = useState("");
  const [newWageType, setNewWageType] = useState<"hourly" | "yearly">("hourly");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setIsAdding(true);
    try {
      const response = await fetch("http://localhost:4000/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: newName,
          wageAmount: newWage,
          wageType: newWageType,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setAddError(data.error || "Could not add employee");
        return;
      }
      setEmployees((prev) => [...prev, data]);
      setNewName("");
      setNewWage("");
      setNewWageType("hourly");
    } catch {
      setAddError("Could not reach the server");
    } finally {
      setIsAdding(false);
    }
  };

  // Inline-edit state — which row is being edited, and its draft values
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editWage, setEditWage] = useState("");
  const [editWageType, setEditWageType] = useState<"hourly" | "yearly">(
    "hourly",
  );

  const startEditing = (employee: Employee) => {
    setEditingId(employee.id);
    setEditName(employee.name);
    setEditWage(employee.wage_amount);
    setEditWageType(employee.wage_type);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveEdit = async (id: number) => {
    setIsSaving(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/employees/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: editName,
            wageAmount: editWage,
            wageType: editWageType,
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Could not save changes");
        return;
      }
      setEmployees((prev) => prev.map((emp) => (emp.id === id ? data : emp)));
      setEditingId(null);
    } catch {
      setError("Could not reach the server");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/employees/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!response.ok) {
        setError("Could not delete employee");
        return;
      }
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch {
      setError("Could not reach the server");
    }
  };

  return (
    <AppLayout activePage="Employees">
      <h3 className="text-xl font-semibold text-white mb-5">Employees</h3>

      {/* Add employee form */}
      <form
        onSubmit={handleAdd}
        className="flex flex-wrap items-end gap-3 mb-8 rounded-xl border p-4"
        style={{ borderColor: "rgba(62,207,142,0.18)" }}
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: "#5E7A6F" }}>
            Name
          </label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Employee name"
            className="rounded-lg px-3 py-2 text-sm bg-transparent border"
            style={{ borderColor: "rgba(62,207,142,0.4)", color: "#DCEAE3" }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: "#5E7A6F" }}>
            Wage
          </label>
          <input
            type="number"
            value={newWage}
            onChange={(e) => setNewWage(e.target.value)}
            placeholder="0.00"
            className="rounded-lg px-3 py-2 text-sm bg-transparent border w-32"
            style={{ borderColor: "rgba(62,207,142,0.4)", color: "#DCEAE3" }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: "#5E7A6F" }}>
            Type
          </label>
          <select
            value={newWageType}
            onChange={(e) =>
              setNewWageType(e.target.value as "hourly" | "yearly")
            }
            className="rounded-lg px-3 py-2 text-sm bg-transparent border cursor-pointer"
            style={{ borderColor: "rgba(62,207,142,0.4)", color: "#DCEAE3" }}
          >
            <option value="hourly" style={{ background: "#0A0F0D" }}>
              Hourly
            </option>
            <option value="yearly" style={{ background: "#0A0F0D" }}>
              Yearly
            </option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isAdding}
          className="rounded-lg px-5 py-2 text-sm font-semibold text-black cursor-pointer disabled:opacity-50"
          style={{ background: "#3ECF8E" }}
        >
          {isAdding ? "Adding..." : "+ Add employee"}
        </button>
        {addError && (
          <p className="text-sm w-full" style={{ color: "#E0574C" }}>
            {addError}
          </p>
        )}
      </form>

      {isLoading && <p style={{ color: "#5E7A6F" }}>Loading employees...</p>}
      {error && <p style={{ color: "#E0574C" }}>{error}</p>}
      {!isLoading && !error && employees.length === 0 && (
        <p style={{ color: "#5E7A6F" }}>
          No employees added yet — add one above.
        </p>
      )}

      {!isLoading && !error && employees.length > 0 && (
        <div
          className="rounded-xl overflow-x-auto border"
          style={{ borderColor: "rgba(62,207,142,0.18)" }}
        >
          <table className="w-full min-w-150 border-collapse text-sm">
            <thead>
              <tr
                className="text-left"
                style={{
                  color: "#EEEEEE",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                }}
              >
                <th className="py-3 px-5 font-normal uppercase">Name</th>
                <th className="py-3 px-5 font-normal uppercase">Wage</th>
                <th className="py-3 px-5 font-normal uppercase">Type</th>
                <th className="py-3 px-5 font-normal uppercase w-40">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, i) => {
                const isEditing = editingId === employee.id;
                return (
                  <tr
                    key={employee.id}
                    style={{
                      borderTop: "1px solid rgba(62,207,142,0.12)",
                      background:
                        i % 2 === 1 ? "rgba(255,255,255,0.015)" : "transparent",
                    }}
                  >
                    <td className="py-3 px-5">
                      {isEditing ? (
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="rounded px-2 py-1 text-sm bg-transparent border w-full"
                          style={{
                            borderColor: "rgba(62,207,142,0.4)",
                            color: "#DCEAE3",
                          }}
                        />
                      ) : (
                        <span className="text-[#DCEAE3] font-medium">
                          {employee.name}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editWage}
                          onChange={(e) => setEditWage(e.target.value)}
                          className="rounded px-2 py-1 text-sm bg-transparent border w-24"
                          style={{
                            borderColor: "rgba(62,207,142,0.4)",
                            color: "#DCEAE3",
                          }}
                        />
                      ) : (
                        <span style={{ color: "#5E7A6F" }}>
                          ${employee.wage_amount}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      {isEditing ? (
                        <select
                          value={editWageType}
                          onChange={(e) =>
                            setEditWageType(
                              e.target.value as "hourly" | "yearly",
                            )
                          }
                          className="rounded px-2 py-1 text-sm bg-transparent border cursor-pointer"
                          style={{
                            borderColor: "rgba(62,207,142,0.4)",
                            color: "#DCEAE3",
                          }}
                        >
                          <option
                            value="hourly"
                            style={{ background: "#0A0F0D" }}
                          >
                            Hourly
                          </option>
                          <option
                            value="yearly"
                            style={{ background: "#0A0F0D" }}
                          >
                            Yearly
                          </option>
                        </select>
                      ) : (
                        <span style={{ color: "#5E7A6F" }}>
                          {employee.wage_type}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(employee.id)}
                            disabled={isSaving}
                            className="rounded-md px-3 py-1 text-xs font-medium cursor-pointer border disabled:opacity-50"
                            style={{ borderColor: "#3ECF8E", color: "#3ECF8E" }}
                          >
                            {isSaving ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="rounded-md px-3 py-1 text-xs font-medium cursor-pointer border"
                            style={{
                              borderColor: "rgba(94,122,111,0.5)",
                              color: "#5E7A6F",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(employee)}
                            className="rounded-md px-3 py-1 text-xs font-medium cursor-pointer border"
                            style={{
                              borderColor: "rgba(62,207,142,0.4)",
                              color: "#3ECF8E",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="rounded-md px-3 py-1 text-xs font-medium cursor-pointer border"
                            style={{
                              borderColor: "rgba(224,87,76,0.4)",
                              color: "#E0574C",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
};;;

export default Employees;
