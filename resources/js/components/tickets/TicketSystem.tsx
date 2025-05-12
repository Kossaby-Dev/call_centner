import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  User,
  Clock,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/call/button";
import { Input } from "@/components/ui/call/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/call/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/call/tabs";
import { Badge } from "@/components/ui/call/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/call/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/call/select";
import { Textarea } from "@/components/ui/call/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/call/avatar";
import { Separator } from "@/components/ui/call/separator";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  responses: {
    id: string;
    text: string;
    createdAt: string;
    user: {
      name: string;
      role: string;
    };
  }[];
}

interface TicketSystemProps {
  userRole?: string;
}

const TicketSystem: React.FC<TicketSystemProps> = ({ userRole = "agent" }) => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTicketDetailOpen, setIsTicketDetailOpen] = useState(false);
  const [newResponse, setNewResponse] = useState("");

  // State for ticket columns
  const [ticketColumns, setTicketColumns] = useState<{
    [key: string]: { title: string; tickets: Ticket[] };
  }>({});

  // Mock data for tickets
  const mockTickets: Ticket[] = [
    {
      id: "TKT-001",
      title: "Unable to access account",
      description:
        "Customer reports being unable to log into their account after password reset.",
      status: "open",
      priority: "high",
      createdAt: "2023-06-15T10:30:00Z",
      updatedAt: "2023-06-15T10:30:00Z",
      customer: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 555-123-4567",
      },
      responses: [],
    },
    {
      id: "TKT-002",
      title: "Billing discrepancy",
      description:
        "Customer reports being charged twice for the monthly subscription.",
      status: "in-progress",
      priority: "medium",
      createdAt: "2023-06-14T15:45:00Z",
      updatedAt: "2023-06-15T09:20:00Z",
      assignedTo: "Sarah Johnson",
      customer: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1 555-987-6543",
      },
      responses: [
        {
          id: "RES-001",
          text: "I have checked the billing system and confirmed the double charge. Processing refund now.",
          createdAt: "2023-06-15T09:20:00Z",
          user: {
            name: "Sarah Johnson",
            role: "Agent",
          },
        },
      ],
    },
    {
      id: "TKT-003",
      title: "Service outage report",
      description:
        "Customer experiencing service disruption in the Dallas area.",
      status: "resolved",
      priority: "urgent",
      createdAt: "2023-06-13T08:15:00Z",
      updatedAt: "2023-06-15T11:45:00Z",
      assignedTo: "Michael Chen",
      customer: {
        name: "Robert Johnson",
        email: "robert.j@example.com",
        phone: "+1 555-456-7890",
      },
      responses: [
        {
          id: "RES-002",
          text: "Identified network issue in Dallas data center. Engineering team notified.",
          createdAt: "2023-06-13T09:30:00Z",
          user: {
            name: "Michael Chen",
            role: "Agent",
          },
        },
        {
          id: "RES-003",
          text: "Network issue resolved. Service restored to all customers in the affected area.",
          createdAt: "2023-06-15T11:45:00Z",
          user: {
            name: "Michael Chen",
            role: "Agent",
          },
        },
      ],
    },
  ];

  // Initialize ticket columns
  React.useEffect(() => {
    const columns = {
      open: {
        title: "Open",
        tickets: mockTickets.filter((ticket) => ticket.status === "open"),
      },
      "in-progress": {
        title: "In Progress",
        tickets: mockTickets.filter(
          (ticket) => ticket.status === "in-progress",
        ),
      },
      resolved: {
        title: "Resolved",
        tickets: mockTickets.filter((ticket) => ticket.status === "resolved"),
      },
      closed: {
        title: "Closed",
        tickets: mockTickets.filter((ticket) => ticket.status === "closed"),
      },
    };
    setTicketColumns(columns);
  }, []);

  const filteredTickets = mockTickets.filter((ticket) => {
    // Filter by tab
    if (selectedTab !== "all" && ticket.status !== selectedTab) {
      return false;
    }

    // Filter by search query
    if (
      searchQuery &&
      !(
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ) {
      return false;
    }

    return true;
  });

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsTicketDetailOpen(true);
  };

  const handleStatusChange = (status: string) => {
    if (selectedTicket) {
      // In a real app, this would update the ticket status via API
      console.log(`Updating ticket ${selectedTicket.id} status to ${status}`);

      // Update the ticket status in our local state
      const updatedTicket = {
        ...selectedTicket,
        status: status as "open" | "in-progress" | "resolved" | "closed",
      };

      // Update the columns
      const newColumns = { ...ticketColumns };

      // Remove the ticket from all columns
      Object.keys(newColumns).forEach((colKey) => {
        newColumns[colKey].tickets = newColumns[colKey].tickets.filter(
          (t) => t.id !== selectedTicket.id,
        );
      });

      // Add the ticket to the new column
      newColumns[status].tickets.push(updatedTicket);

      setTicketColumns(newColumns);
      setSelectedTicket(updatedTicket);
      setIsTicketDetailOpen(false);
    }
  };

  const handleAssignTicket = (agent: string) => {
    if (selectedTicket) {
      // In a real app, this would assign the ticket via API
      console.log(`Assigning ticket ${selectedTicket.id} to ${agent}`);
      // For demo purposes, we'll just close the dialog
      setIsTicketDetailOpen(false);
    }
  };

  const handleAddResponse = () => {
    if (selectedTicket && newResponse.trim()) {
      // In a real app, this would add a response via API
      console.log(
        `Adding response to ticket ${selectedTicket.id}: ${newResponse}`,
      );
      setNewResponse("");
      // For demo purposes, we'll just acknowledge
      alert("Response added successfully!");
    }
  };

  const handleCreateTicket = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, this would create a new ticket via API
    console.log("Creating new ticket");
    setIsCreateDialogOpen(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Handle drag end event
  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the item was dropped back in its original position
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    // Find the ticket that was dragged
    const sourceColumn = ticketColumns[source.droppableId];
    const draggedTicket = sourceColumn.tickets[source.index];

    // Create new ticket with updated status
    const updatedTicket = {
      ...draggedTicket,
      status: destination.droppableId as
        | "open"
        | "in-progress"
        | "resolved"
        | "closed",
    };

    // Create new columns object
    const newColumns = { ...ticketColumns };

    // Remove from source column
    newColumns[source.droppableId].tickets = newColumns[
      source.droppableId
    ].tickets.filter((_, index) => index !== source.index);

    // Add to destination column
    newColumns[destination.droppableId].tickets.splice(
      destination.index,
      0,
      updatedTicket,
    );

    // Update state
    setTicketColumns(newColumns);

    // In a real app, this would update the ticket status via API
    console.log(
      `Moved ticket ${draggedTicket.id} from ${source.droppableId} to ${destination.droppableId}`,
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ticket Management</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Ticket
        </Button>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Search tickets by ID, title, or customer name"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select defaultValue="newest">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="flex items-center">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>

      {/* Kanban Board View */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {Object.entries(ticketColumns).map(([columnId, column]) => (
            <div key={columnId} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-lg mb-3 flex items-center">
                <Badge className={getStatusColor(columnId)} variant="secondary">
                  {column.title}
                </Badge>
                <span className="ml-2 text-gray-500 text-sm">
                  {column.tickets.length}
                </span>
              </h3>

              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3 min-h-[200px]"
                  >
                    {column.tickets.map((ticket, index) => (
                      <Draggable
                        key={ticket.id}
                        draggableId={ticket.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`cursor-pointer ${snapshot.isDragging ? "shadow-lg" : ""}`}
                          >
                            <CardContent className="p-3 relative">
                              <div
                                {...provided.dragHandleProps}
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                              >
                                <GripVertical size={16} />
                              </div>

                              <div
                                className="pr-6"
                                onClick={() => handleTicketClick(ticket)}
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-500 text-xs">
                                    {ticket.id}
                                  </span>
                                  <h3 className="font-semibold text-sm">
                                    {ticket.title}
                                  </h3>
                                </div>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {ticket.description}
                                </p>

                                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                                  <div className="flex items-center">
                                    <User className="mr-1 h-3 w-3" />
                                    <span className="truncate max-w-[100px]">
                                      {ticket.customer.name}
                                    </span>
                                  </div>

                                  <Badge
                                    className={getPriorityColor(
                                      ticket.priority,
                                    )}
                                  >
                                    {ticket.priority.charAt(0).toUpperCase() +
                                      ticket.priority.slice(1)}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Original Tabs View - Hidden but kept for reference */}
      <div className="hidden">
        <Tabs
          defaultValue="all"
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleTicketClick(ticket)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-500">
                            {ticket.id}
                          </span>
                          <h3 className="font-semibold">{ticket.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {ticket.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.charAt(0).toUpperCase() +
                            ticket.status.slice(1)}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority.charAt(0).toUpperCase() +
                            ticket.priority.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <User className="mr-1 h-4 w-4" />
                          <span>{ticket.customer.name}</span>
                        </div>
                        {ticket.assignedTo && (
                          <div className="flex items-center">
                            <span>Assigned to: {ticket.assignedTo}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>{formatDate(ticket.updatedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  No tickets found matching your criteria
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="open" className="space-y-4">
            {/* Same structure as "all" tab but filtered for open tickets */}
          </TabsContent>
          <TabsContent value="in-progress" className="space-y-4">
            {/* Same structure as "all" tab but filtered for in-progress tickets */}
          </TabsContent>
          <TabsContent value="resolved" className="space-y-4">
            {/* Same structure as "all" tab but filtered for resolved tickets */}
          </TabsContent>
          <TabsContent value="closed" className="space-y-4">
            {/* Same structure as "all" tab but filtered for closed tickets */}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Ticket Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new support ticket.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTicket}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="title" className="text-right font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  className="col-span-3"
                  placeholder="Brief description of the issue"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="customer" className="text-right font-medium">
                  Customer
                </label>
                <Select defaultValue="">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="robert-johnson">
                      Robert Johnson
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="priority" className="text-right font-medium">
                  Priority
                </label>
                <Select defaultValue="medium">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <label htmlFor="description" className="text-right font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  className="col-span-3"
                  placeholder="Detailed description of the issue"
                  rows={5}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Ticket</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Ticket Detail Dialog */}
      <Dialog open={isTicketDetailOpen} onOpenChange={setIsTicketDetailOpen}>
        {selectedTicket && (
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    {selectedTicket.id}
                  </span>
                  <DialogTitle className="mt-1">
                    {selectedTicket.title}
                  </DialogTitle>
                </div>
                <div className="flex space-x-2">
                  <Badge className={getPriorityColor(selectedTicket.priority)}>
                    {selectedTicket.priority.charAt(0).toUpperCase() +
                      selectedTicket.priority.slice(1)}
                  </Badge>
                  <Badge className={getStatusColor(selectedTicket.status)}>
                    {selectedTicket.status.charAt(0).toUpperCase() +
                      selectedTicket.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="col-span-2">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-700">{selectedTicket.description}</p>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Customer Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedTicket.customer.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedTicket.customer.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedTicket.customer.phone}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Ticket History</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">Ticket Created</span>
                        <span className="text-gray-500 text-sm">
                          {formatDate(selectedTicket.createdAt)}
                        </span>
                      </div>
                    </div>

                    {selectedTicket.responses.map((response) => (
                      <div
                        key={response.id}
                        className="bg-gray-50 p-3 rounded-md"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback>
                                {response.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {response.user.name}
                            </span>
                            <span className="text-gray-500 text-xs ml-2">
                              ({response.user.role})
                            </span>
                          </div>
                          <span className="text-gray-500 text-sm">
                            {formatDate(response.createdAt)}
                          </span>
                        </div>
                        <p className="mt-2">{response.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Add Response</h3>
                  <Textarea
                    placeholder="Type your response here..."
                    rows={3}
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <Button onClick={handleAddResponse}>
                      <MessageSquare className="mr-2 h-4 w-4" /> Add Response
                    </Button>
                  </div>
                </div>
              </div>

              <div className="col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ticket Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Update Status
                      </h4>
                      <Select
                        defaultValue={selectedTicket.status}
                        onValueChange={handleStatusChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Assign Ticket
                      </h4>
                      <Select
                        defaultValue={selectedTicket.assignedTo || ""}
                        onValueChange={handleAssignTicket}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select agent" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Unassigned</SelectItem>
                          <SelectItem value="Sarah Johnson">
                            Sarah Johnson
                          </SelectItem>
                          <SelectItem value="Michael Chen">
                            Michael Chen
                          </SelectItem>
                          <SelectItem value="Emily Rodriguez">
                            Emily Rodriguez
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="pt-2">
                      <Button variant="outline" className="w-full mb-2">
                        <AlertCircle className="mr-2 h-4 w-4" /> Escalate
                      </Button>
                      <Button variant="outline" className="w-full">
                        <CheckCircle className="mr-2 h-4 w-4" /> Mark as
                        Resolved
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Ticket Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Created:</span>
                      <span className="text-sm ml-2">
                        {formatDate(selectedTicket.createdAt)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Last Updated:</span>
                      <span className="text-sm ml-2">
                        {formatDate(selectedTicket.updatedAt)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Responses:</span>
                      <span className="text-sm ml-2">
                        {selectedTicket.responses.length}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default TicketSystem;
