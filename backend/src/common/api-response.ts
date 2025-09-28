// src/common/api-response.ts
export class ApiResponse {
  static success(message: string, data: any = null) {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message: string, statusCode: number) {
    return {
      success: false,
      message,
      statusCode,
    };
  }
}
