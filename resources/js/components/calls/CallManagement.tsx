import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/call/card";
import { Button } from "@/components/ui/call/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/call/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/call/avatar";
import { Badge } from "@/components/ui/call/badge";
import { Separator } from "@/components/ui/call/separator";
import { Input } from "@/components/ui/call/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/call/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/call/select";
import {
  Phone,
  PhoneCall,
  PhoneForwarded,
  PhoneOff,
  Mic,
  MicOff,
  UserPlus,
  Clock,
  MessageSquare,
} from "lucide-react";

interface Call {
  id: string;
  callerName: string;
  callerNumber: string;
  callerAvatar?: string;
  status: "incoming" | "active" | "on-hold" | "ended";
  startTime: Date;
  duration: number; // in seconds
  notes?: string;
  agentId?: string;
  agentName?: string;
}

interface CallManagementProps {
  userRole?: "agent" | "supervisor";
  calls?: Call[];
  onAnswerCall?: (callId: string) => void;
  onEndCall?: (callId: string) => void;
  onTransferCall?: (callId: string, agentId: string) => void;
  onCreateTicket?: (callId: string, ticketData: any) => void;
}

const CallManagement: React.FC<CallManagementProps> = ({
  userRole = "agent",
  calls = [
    {
      id: "1",
      callerName: "John Doe",
      callerNumber: "+1 (555) 123-4567",
      status: "incoming",
      startTime: new Date(),
      duration: 0,
    },
    {
      id: "2",
      callerName: "Jane Smith",
      callerNumber: "+1 (555) 987-6543",
      status: "active",
      startTime: new Date(Date.now() - 120000), // 2 minutes ago
      duration: 120,
    },
    {
      id: "3",
      callerName: "Robert Johnson",
      callerNumber: "+1 (555) 456-7890",
      status: "on-hold",
      startTime: new Date(Date.now() - 300000), // 5 minutes ago
      duration: 300,
    },
  ] as Call[],
  onAnswerCall = () => {},
  onEndCall = () => {},
  onTransferCall = () => {},
  onCreateTicket = () => {},
}) => {
  const [activeCallId, setActiveCallId] = useState<string | null>(
    calls.find((call) => call.status === "active")?.id || null,
  );
  const [isRecording, setIsRecording] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [createTicketDialogOpen, setCreateTicketDialogOpen] = useState(false);
  const [callNotes, setCallNotes] = useState("");

  // Mock data for agents (would come from API in real app)
  const availableAgents = [
    { id: "agent1", name: "Alex Johnson", status: "available" },
    { id: "agent2", name: "Maria Garcia", status: "available" },
    { id: "agent3", name: "Sam Wilson", status: "busy" },
    { id: "agent4", name: "Taylor Kim", status: "available" },
  ];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "incoming":
        return "bg-yellow-500";
      case "active":
        return "bg-green-500";
      case "on-hold":
        return "bg-blue-500";
      case "ended":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const activeCall = calls.find((call) => call.id === activeCallId);

  const handleAnswerCall = (callId: string) => {
    setActiveCallId(callId);
    onAnswerCall(callId);
  };

  const handleEndCall = (callId: string) => {
    if (activeCallId === callId) {
      setActiveCallId(null);
    }
    onEndCall(callId);
  };

  const handleTransferCall = (agentId: string) => {
    if (activeCallId) {
      onTransferCall(activeCallId, agentId);
      setTransferDialogOpen(false);
    }
  };

  const handleCreateTicket = () => {
    if (activeCallId) {
      onCreateTicket(activeCallId, { notes: callNotes });
      setCreateTicketDialogOpen(false);
      setCallNotes("");
    }
  };

  return (
    <div className="bg-background w-full p-4 rounded-lg">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Call Management</h2>
          <Button variant="outline" className="flex items-center gap-2">
            <PhoneCall size={16} />
            New Call
          </Button>
        </div>

        <Tabs defaultValue="active">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active Calls</TabsTrigger>
            <TabsTrigger value="incoming">Incoming Calls</TabsTrigger>
            <TabsTrigger value="history">Call History</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 mt-4">
            {calls.filter((call) => ["active", "on-hold"].includes(call.status))
              .length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calls
                  .filter((call) => ["active", "on-hold"].includes(call.status))
                  .map((call) => (
                    <Card
                      key={call.id}
                      className={`overflow-hidden ${call.id === activeCallId ? "border-primary" : ""}`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${getStatusColor(call.status)}`}
                            ></div>
                            <CardTitle>{call.callerName}</CardTitle>
                          </div>
                          <Badge
                            variant={
                              call.status === "active" ? "default" : "outline"
                            }
                          >
                            {call.status === "active" ? "Active" : "On Hold"}
                          </Badge>
                        </div>
                        <CardDescription>{call.callerNumber}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={16} className="text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {formatDuration(call.duration)}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveCallId(call.id)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleEndCall(call.id)}
                        >
                          <PhoneOff size={16} className="mr-1" /> End
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground">
                    No active calls at the moment
                  </p>
                  <Button variant="outline" className="mt-4">
                    <PhoneCall size={16} className="mr-2" /> Make a call
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="incoming" className="space-y-4 mt-4">
            {calls.filter((call) => call.status === "incoming").length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calls
                  .filter((call) => call.status === "incoming")
                  .map((call) => (
                    <Card key={call.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                            <CardTitle>{call.callerName}</CardTitle>
                          </div>
                          <Badge variant="secondary">Incoming</Badge>
                        </div>
                        <CardDescription>{call.callerNumber}</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEndCall(call.id)}
                        >
                          Decline
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleAnswerCall(call.id)}
                        >
                          <Phone size={16} className="mr-1" /> Answer
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">
                    No incoming calls at the moment
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Call History</CardTitle>
                <CardDescription>
                  View your recent call activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* This would be populated with call history data */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>MG</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Michael Green</p>
                        <p className="text-sm text-muted-foreground">
                          +1 (555) 234-5678
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Outgoing</Badge>
                      <span className="text-sm text-muted-foreground">
                        Today, 10:23 AM
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>SL</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Sarah Lee</p>
                        <p className="text-sm text-muted-foreground">
                          +1 (555) 876-5432
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Incoming</Badge>
                      <span className="text-sm text-muted-foreground">
                        Yesterday, 3:45 PM
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>DW</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">David Wong</p>
                        <p className="text-sm text-muted-foreground">
                          +1 (555) 345-6789
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Missed</Badge>
                      <span className="text-sm text-muted-foreground">
                        Yesterday, 11:20 AM
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {activeCall && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Active Call Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center justify-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={activeCall.callerAvatar} />
                    <AvatarFallback className="text-2xl">
                      {activeCall.callerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold">
                    {activeCall.callerName}
                  </h3>
                  <p className="text-muted-foreground">
                    {activeCall.callerNumber}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(activeCall.status)}`}
                    ></div>
                    <span className="capitalize">{activeCall.status}</span>
                  </div>
                  <p className="mt-2 text-sm">
                    <Clock size={14} className="inline mr-1" />
                    {formatDuration(activeCall.duration)}
                  </p>
                </div>

                <div className="col-span-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Call Notes</h4>
                      <Input
                        placeholder="Add notes about this call..."
                        value={callNotes}
                        onChange={(e) => setCallNotes(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={isRecording ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => setIsRecording(!isRecording)}
                      >
                        {isRecording ? (
                          <MicOff size={16} className="mr-1" />
                        ) : (
                          <Mic size={16} className="mr-1" />
                        )}
                        {isRecording ? "Stop Recording" : "Start Recording"}
                      </Button>

                      <Dialog
                        open={transferDialogOpen}
                        onOpenChange={setTransferDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <PhoneForwarded size={16} className="mr-1" />{" "}
                            Transfer
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Transfer Call</DialogTitle>
                            <DialogDescription>
                              Select an agent to transfer this call to.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Select onValueChange={handleTransferCall}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an agent" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableAgents.map((agent) => (
                                    <SelectItem
                                      key={agent.id}
                                      value={agent.id}
                                      disabled={agent.status !== "available"}
                                    >
                                      {agent.name}{" "}
                                      {agent.status !== "available" && "(Busy)"}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setTransferDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog
                        open={createTicketDialogOpen}
                        onOpenChange={setCreateTicketDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MessageSquare size={16} className="mr-1" /> Create
                            Ticket
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create Support Ticket</DialogTitle>
                            <DialogDescription>
                              Create a ticket for this call to track follow-up
                              actions.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <label
                                htmlFor="ticket-title"
                                className="text-sm font-medium"
                              >
                                Ticket Title
                              </label>
                              <Input
                                id="ticket-title"
                                placeholder="Enter ticket title"
                              />
                            </div>
                            <div className="grid gap-2">
                              <label
                                htmlFor="ticket-description"
                                className="text-sm font-medium"
                              >
                                Description
                              </label>
                              <Input
                                id="ticket-description"
                                placeholder="Enter ticket description"
                              />
                            </div>
                            <div className="grid gap-2">
                              <label
                                htmlFor="ticket-priority"
                                className="text-sm font-medium"
                              >
                                Priority
                              </label>
                              <Select>
                                <SelectTrigger id="ticket-priority">
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
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setCreateTicketDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleCreateTicket}>
                              Create Ticket
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleEndCall(activeCall.id)}
                      >
                        <PhoneOff size={16} className="mr-1" /> End Call
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {userRole === "supervisor" && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Agent Call Status</CardTitle>
              <CardDescription>
                Monitor your team's call activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {agent.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {agent.status === "available"
                            ? "Available"
                            : "In a call"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${agent.status === "available" ? "bg-green-500" : "bg-yellow-500"}`}
                      ></div>
                      <Button variant="ghost" size="sm">
                        <UserPlus size={16} className="mr-1" /> Assign Call
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CallManagement;
