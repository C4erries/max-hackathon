export const queryKeys = {
  events: {
    all: ["events"] as const,
    lists: () => [...queryKeys.events.all, "list"] as const,
    list: (filters?: unknown) => [...queryKeys.events.lists(), { filters }] as const,
    details: () => [...queryKeys.events.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.events.details(), id] as const,
    my: () => [...queryKeys.events.all, "my"] as const,
  },
  electives: {
    all: ["electives"] as const,
    lists: () => [...queryKeys.electives.all, "list"] as const,
    list: (filters?: unknown) => [...queryKeys.electives.lists(), { filters }] as const,
    details: () => [...queryKeys.electives.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.electives.details(), id] as const,
    my: () => [...queryKeys.electives.all, "my"] as const,
  },
  approvalRequests: {
    all: ["approvalRequests"] as const,
    lists: () => [...queryKeys.approvalRequests.all, "list"] as const,
    list: () => [...queryKeys.approvalRequests.lists()] as const,
  },
  myRequests: {
    all: ["myRequests"] as const,
    lists: () => [...queryKeys.myRequests.all, "list"] as const,
    list: () => [...queryKeys.myRequests.lists()] as const,
  },
        requestDetail: {
          all: ["requestDetail"] as const,
          details: () => [...queryKeys.requestDetail.all, "detail"] as const,
          detail: (id: number) => [...queryKeys.requestDetail.details(), id] as const,
        },
        requestDocuments: {
          all: ["requestDocuments"] as const,
          lists: () => [...queryKeys.requestDocuments.all, "list"] as const,
          list: (requestId: number) => [...queryKeys.requestDocuments.lists(), requestId] as const,
        },
  profile: {
    all: ["profile"] as const,
  },
        libraryAccess: {
          all: ["libraryAccess"] as const,
        },
        userRole: {
          all: ["userRole"] as const,
          details: () => [...queryKeys.userRole.all, "detail"] as const,
          detail: (userId: number) => [...queryKeys.userRole.details(), userId] as const,
        },
} as const;

