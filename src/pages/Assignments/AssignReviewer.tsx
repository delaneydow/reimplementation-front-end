import dummyTopicData from "./Data/DummyTopics.json";
import React, { useState, useMemo } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useLoaderData } from 'react-router-dom';
import Table from "components/Table/Table";
import { createColumnHelper } from "@tanstack/react-table";

interface ReviewerAssignment {
  topic: string;
  contributors: string[]; // contributors are just array of string
  reviewers: { name: string, status: string }[];
}

const columnHelper = createColumnHelper<ReviewerAssignment>();

const AssignReviewer: React.FC = () => {
  const assignment: any = useLoaderData();
  
  const [data, setData] = useState<ReviewerAssignment[]>([
    {
      topic: "E2450. Refactor assignments_controller.rb",
      contributors: ["Alice anna", "Bob sam"],
      reviewers: [{ name: "User1", status: "Submitted" }]
    },
    {
      topic: "E2451. Reimplement feedback_response_map.rb",
      contributors: ["Bob sam", "Eve wesley"],
      reviewers: [
        { name: "user2", status: "Pending" },
        { name: "user3", status: "Submitted" }
      ]
    },
    {
      topic: "E2452. Refactor review_mapping_controller.rb",
      contributors: ["Charlie boo"],
      reviewers: []
    },
    {
      topic: "E2458. User management and users table",
      contributors: ["Harley jad", "Javed son", "Leo mee"],
      reviewers: [
        { name: "user2", status: "Pending" },
        { name: "user3", status: "Submitted" }
      ]
    },
    {
      topic: "E2467. UI for View Submissions",
      contributors: ["Shadow box", "Bradon kin"],
      reviewers: [
        { name: "user2", status: "Pending" },
        { name: "user3", status: "Submitted" }
      ]
    }
  ]);

  const addReviewer = (topic: string) => {
    setData(prev =>
      prev.map(row =>
        row.topic === topic && row.reviewers.length < 3
          ? { ...row, reviewers: [...row.reviewers, { name: `NewReviewer${row.reviewers.length + 1}`,
            username: `new_user${row.reviewers.length + 1}`,
             status: "Pending" }] }
          : row
      )
    );
  };

  const deleteReviewer = (topic: string, reviewerName: string) => {
    setData(prev =>
      prev.map(row =>
        row.topic === topic
          ? { ...row, reviewers: row.reviewers.filter(r => r.name !== reviewerName) }
          : row
      )
    );
  };

  const unsubmitReviewer = (topic: string, reviewerName: string) => {
    setData(prev =>
      prev.map(row =>
        row.topic === topic
          ? {
              ...row,
              reviewers: row.reviewers.map(r =>
                r.name === reviewerName ? { ...r, status: "Pending" } : r
              )
            }
          : row
      )
    );
  };

  const columns = useMemo(() => [
    columnHelper.accessor("topic", {
      id: 'select',
      header: "Topic",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("contributors", {
      header: "Contributors",
      cell: info => {
        const { contributors, topic, reviewers } = info.row.original;
    
        // Helper to check if there are any pending reviewers
        const hasPending = reviewers.some(r => r.status === "Pending");
    
        return (
          <div>
            {contributors.join(", ")}
    
            {/* Add Reviewer Button */}
            {reviewers.length < 3 && (
              <div className="mt-2">
                <Button
                  variant="outline-success"
                  size="sm"
                  className="me-2"
                  onClick={() => addReviewer(topic)}
                >
                  Add Reviewer
                </Button>
              </div>
            )}
    
            {/* Delete All Pending Reviews Button */}
            {hasPending && (
              <div className="mt-2">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => {
                    setData(prev =>
                      prev.map(row =>
                        row.topic === topic
                          ? {
                              ...row,
                              reviewers: row.reviewers.filter(r => r.status !== "Pending")
                            }
                          : row
                      )
                    );
                  }}
                >
                  Delete Outstanding Reviews
                </Button>
              </div>
            )}
          </div>
        );
      }
    }),
    columnHelper.accessor("reviewers", {
      id: 'actions',
      header: "Reviewed By",
      cell: info => {
        const { reviewers, topic } = info.row.original;
        return (
          <div>
            {reviewers.map((r, idx) => (
              <div key={idx}>
                {r.name} ({r.status}){" "}
                <Button variant="outline-warning" size="sm" onClick={() => unsubmitReviewer(topic, r.name)}>Unsubmit</Button>{" "}
                <Button variant="outline-danger" size="sm" onClick={() => deleteReviewer(topic, r.name)}>Delete</Button>
              </div>
            ))}
          </div>
        );
      }
    }),
  ], [data]);

  return (
    <Container>
  <h1 className="text-center mt-5 mb-4">
    Assign Reviewer - {assignment.name}
  </h1>

  <div className="mt-4">
    <Table
      data={data}
      columns={columns}
      columnVisibility={{ id: false }}
    />
  </div>
</Container>
  );
};

export default AssignReviewer;
