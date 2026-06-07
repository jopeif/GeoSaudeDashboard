import { useState } from "react";

import { AgentsTab } from "./components/AgentsTab";
import { RegistrationRequestsTab } from "./components/RegistrationRequestsTab";

import "./AgentsActivity.css";

type TabType = "agents" | "requests";

export const AgentsActivityPage = () => {

    const [activeTab, setActiveTab] =
        useState<TabType>("agents");

    return (
        <div className="dashboard-home agents-page">

            <div className="agents-header">

                <h2 className="agents-page-title">
                    Agentes
                </h2>

                <div className="agents-tabs">

                    <button
                        className={
                            activeTab === "agents"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab("agents")
                        }
                    >
                        Agentes
                    </button>

                    <button
                        className={
                            activeTab === "requests"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab("requests")
                        }
                    >
                        Solicitações de cadastro
                    </button>

                </div>

            </div>

            <div className="agents-tab-content">

                {
                    activeTab === "agents"
                        ? <AgentsTab />
                        : <RegistrationRequestsTab />
                }

            </div>

        </div>
    );

};