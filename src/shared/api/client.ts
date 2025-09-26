import type {
  ApiQueryParams,
  MetricApiResponse,
  MetricKey,
  Department,
  PlanData,
} from "./types";

class ApiClient {
  private getBaseUrl(): string {
    const config = useRuntimeConfig();
    return config.public.apiHost as string;
  }

  private buildQueryString(params: ApiQueryParams): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Handle array parameters like employee_ids[]
          value.forEach((item) => {
            searchParams.append(`${key}[]`, item.toString());
          });
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    return searchParams.toString();
  }

  async fetchMetric(
    key: MetricKey,
    params: ApiQueryParams = {},
  ): Promise<MetricApiResponse> {
    const queryString = this.buildQueryString(params);
    const url = `${this.getBaseUrl()}/api/${key}${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async fetchDepartments(): Promise<Department[]> {
    const url = `${this.getBaseUrl()}/api/departments`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async fetchPlans(month?: string): Promise<PlanData[]> {
    const params: Record<string, string> = {};
    if (month) {
      params.month = month;
    }

    const queryString = new URLSearchParams(params).toString();
    const url = `${this.getBaseUrl()}/api/plans${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async savePlans(plans: PlanData[]): Promise<void> {
    const url = `${this.getBaseUrl()}/api/plans`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plans }),
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }
  }
}

export const apiClient = new ApiClient();
