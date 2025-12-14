import React from "react";

interface OrderSearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    totalResults: number;
}

export const OrderSearchBar: React.FC<OrderSearchBarProps> = ({
    searchTerm,
    onSearchChange,
    totalResults,
}) => {
    return (
        <div className="card mb-4">
            <div className="card-body">
                <div className="row align-items-center">
                    <div className="col-md-4">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm kiếm theo mã đơn hàng..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-8 text-end">
                        <small className="text-muted">
                            Tìm thấy <strong>{totalResults}</strong> kết quả
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};
