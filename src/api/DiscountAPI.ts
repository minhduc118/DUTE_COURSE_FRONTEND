import { API_BASE_URL } from "../config/config";
import { getAuthHeaders } from "./apiHelper";

export interface DiscountValidationResult {
    valid: boolean;
    discountAmount: number;
    newPrice: number;
    message: string;
    discountType?: 'PERCENTAGE' | 'FIXED';
    discountValue?: number;
}

export async function validateDiscountCode(
    code: string,
    courseId: number,
    originalPrice: number
): Promise<DiscountValidationResult> {

    const url = `${API_BASE_URL}/api/discounts/validate`;
    const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ code, courseId, originalPrice }),
    });

    if (!response.ok) {
        return {
            valid: false,
            discountAmount: 0,
            newPrice: originalPrice,
            message: "Không thể kiểm tra mã giảm giá. Vui lòng thử lại."
        };
    }
    const result: DiscountValidationResult = await response.json();
    return result;
}
