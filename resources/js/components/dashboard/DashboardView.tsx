import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/call/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/call/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/call/avatar";
import { Badge } from "@/components/ui/call/badge";
import { Progress } from "@/components/ui/call/progress";
import {
  Bell,
  Phone,
  Ticket,
  Users,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import CallManagement from "@/components/calls/CallManagement";
import TicketSystem from "@/components/tickets/TicketSystem";

interface DashboardViewProps {
  userRole?: "agent" | "supervisor";
  userName?: string;
}

const DashboardView = ({
  userRole = "agent",
  userName = "John Doe",
}: DashboardViewProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "call",
      message: "New incoming call from +1 555-123-4567",
      time: "2 mins ago",
    },
    {
      id: 2,
      type: "ticket",
      message: "Ticket #1234 has been assigned to you",
      time: "15 mins ago",
    },
    {
      id: 3,
      type: "system",
      message: "System maintenance scheduled for tonight",
      time: "1 hour ago",
    },
  ]);

  // Mock data for KPIs
  const agentKPIs = {
    callsHandled: 24,
    avgCallTime: "3:45",
    ticketsResolved: 12,
    satisfaction: 92,
  };

  const teamKPIs = {
    totalCalls: 156,
    avgWaitTime: "1:20",
    openTickets: 34,
    agentsActive: 8,
  };

  // Mock data for agents (for supervisor view)
  const agents = [
    { id: 1, name: "Alice Smith", status: "online", calls: 18, tickets: 7 },
    { id: 2, name: "Bob Johnson", status: "on-call", calls: 22, tickets: 5 },
    { id: 3, name: "Carol Williams", status: "break", calls: 15, tickets: 10 },
    { id: 4, name: "Dave Brown", status: "offline", calls: 0, tickets: 0 },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4">
        <div className="flex items-center space-x-2 mb-8">
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123" />
            <AvatarFallback>
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{userName}</h3>
            <Badge variant="outline" className="capitalize">
              {userRole}
            </Badge>
          </div>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center space-x-2 p-2 rounded-md ${activeTab === "overview" ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"}`}
          >
            <Activity size={18} />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab("calls")}
            className={`w-full flex items-center space-x-2 p-2 rounded-md ${activeTab === "calls" ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"}`}
          >
            <Phone size={18} />
            <span>Call Management</span>
          </button>
          <button
            onClick={() => setActiveTab("tickets")}
            className={`w-full flex items-center space-x-2 p-2 rounded-md ${activeTab === "tickets" ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"}`}
          >
            <Ticket size={18} />
            <span>Ticket System</span>
          </button>
          {userRole === "supervisor" && (
            <button
              onClick={() => setActiveTab("agents")}
              className={`w-full flex items-center space-x-2 p-2 rounded-md ${activeTab === "agents" ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"}`}
            >
              <Users size={18} />
              <span>Agent Management</span>
            </button>
          )}
        </nav>

        <div className="mt-auto pt-8">
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <Bell size={16} className="mr-2" />
            Notifications
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="text-xs p-2 border rounded-md"
              >
                <div className="font-medium">{notification.message}</div>
                <div className="text-muted-foreground mt-1">
                  {notification.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          {userRole === "supervisor"
            ? "Supervisor Dashboard"
            : "Agent Dashboard"}
        </h1>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {userRole === "agent" ? (
                <>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Calls Handled
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {agentKPIs.callsHandled}
                      </div>
                      <p className="text-xs text-muted-foreground">Today</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Avg. Call Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {agentKPIs.avgCallTime}
                      </div>
                      <p className="text-xs text-muted-foreground">Minutes</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Tickets Resolved
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {agentKPIs.ticketsResolved}
                      </div>
                      <p className="text-xs text-muted-foreground">Today</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Satisfaction
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {agentKPIs.satisfaction}%
                      </div>
                      <Progress
                        value={agentKPIs.satisfaction}
                        className="mt-2"
                      />
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Calls
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {teamKPIs.totalCalls}
                      </div>
                      <p className="text-xs text-muted-foreground">Today</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Avg. Wait Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {teamKPIs.avgWaitTime}
                      </div>
                      <p className="text-xs text-muted-foreground">Minutes</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Open Tickets
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {teamKPIs.openTickets}
                      </div>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Agents Active
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {teamKPIs.agentsActive}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Of 12 total
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest calls and tickets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-4 bg-primary/10 p-2 rounded-full">
                      <Phone size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Call with Jane Smith</p>
                      <p className="text-sm text-muted-foreground">
                        Issue resolved in 4:32 minutes
                      </p>
                    </div>
                    <div className="ml-auto text-sm text-muted-foreground">
                      <Clock size={14} className="inline mr-1" /> 35 mins ago
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 bg-primary/10 p-2 rounded-full">
                      <Ticket size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Ticket #4321 Updated</p>
                      <p className="text-sm text-muted-foreground">
                        Added response to customer inquiry
                      </p>
                    </div>
                    <div className="ml-auto text-sm text-muted-foreground">
                      <Clock size={14} className="inline mr-1" /> 1 hour ago
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 bg-primary/10 p-2 rounded-full">
                      <Phone size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Call with Mike Johnson</p>
                      <p className="text-sm text-muted-foreground">
                        Transferred to technical support
                      </p>
                    </div>
                    <div className="ml-auto text-sm text-muted-foreground">
                      <Clock size={14} className="inline mr-1" /> 2 hours ago
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agent Status (Supervisor View) */}
            {userRole === "supervisor" && (
              <Card>
                <CardHeader>
                  <CardTitle>Agent Status</CardTitle>
                  <CardDescription>Current status of your team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {agents.map((agent) => (
                      <div key={agent.id} className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=agent${agent.id}`}
                          />
                          <AvatarFallback>
                            {agent.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <div className="flex items-center">
                            <Badge
                              variant={
                                agent.status === "online"
                                  ? "default"
                                  : agent.status === "on-call"
                                    ? "secondary"
                                    : agent.status === "break"
                                      ? "outline"
                                      : "destructive"
                              }
                              className="text-xs mr-2"
                            >
                              {agent.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {agent.calls} calls · {agent.tickets} tickets
                            </span>
                          </div>
                        </div>
                        <div className="ml-auto flex space-x-2">
                          <Phone
                            size={16}
                            className="text-muted-foreground hover:text-primary cursor-pointer"
                          />
                          <Ticket
                            size={16}
                            className="text-muted-foreground hover:text-primary cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Call Management Tab */}
        {activeTab === "calls" && <CallManagement userRole={userRole} />}

        {/* Ticket System Tab */}
        {activeTab === "tickets" && <TicketSystem userRole={userRole} />}

        {/* Agent Management Tab (Supervisor only) */}
        {activeTab === "agents" && userRole === "supervisor" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
                <CardDescription>
                  Detailed metrics for your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted/50">
                      <tr>
                        <th className="px-4 py-3">Agent</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Calls Today</th>
                        <th className="px-4 py-3">Avg. Call Time</th>
                        <th className="px-4 py-3">Tickets Resolved</th>
                        <th className="px-4 py-3">Satisfaction</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-3 flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=agent1" />
                            <AvatarFallback>AS</AvatarFallback>
                          </Avatar>
                          Alice Smith
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="default">Online</Badge>
                        </td>
                        <td className="px-4 py-3">18</td>
                        <td className="px-4 py-3">3:24</td>
                        <td className="px-4 py-3">7</td>
                        <td className="px-4 py-3 flex items-center">
                          <span className="mr-2">95%</span>
                          <CheckCircle size={16} className="text-green-500" />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3 flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=agent2" />
                            <AvatarFallback>BJ</AvatarFallback>
                          </Avatar>
                          Bob Johnson
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary">On Call</Badge>
                        </td>
                        <td className="px-4 py-3">22</td>
                        <td className="px-4 py-3">4:12</td>
                        <td className="px-4 py-3">5</td>
                        <td className="px-4 py-3 flex items-center">
                          <span className="mr-2">88%</span>
                          <CheckCircle size={16} className="text-green-500" />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3 flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=agent3" />
                            <AvatarFallback>CW</AvatarFallback>
                          </Avatar>
                          Carol Williams
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">Break</Badge>
                        </td>
                        <td className="px-4 py-3">15</td>
                        <td className="px-4 py-3">2:45</td>
                        <td className="px-4 py-3">10</td>
                        <td className="px-4 py-3 flex items-center">
                          <span className="mr-2">92%</span>
                          <CheckCircle size={16} className="text-green-500" />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=agent4" />
                            <AvatarFallback>DB</AvatarFallback>
                          </Avatar>
                          Dave Brown
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="destructive">Offline</Badge>
                        </td>
                        <td className="px-4 py-3">0</td>
                        <td className="px-4 py-3">-</td>
                        <td className="px-4 py-3">0</td>
                        <td className="px-4 py-3 flex items-center">
                          <span className="mr-2">-</span>
                          <AlertCircle
                            size={16}
                            className="text-muted-foreground"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardView;
