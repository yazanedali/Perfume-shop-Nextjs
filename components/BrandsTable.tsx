"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { updateProductLimit } from "@/actions/product.action";

interface BrandData {
  sellerName: string;
  sellerEmail: string;
  productLimit: number;
  brandCount: number;
  productCount: number;
  ownerLogo: string | null;
}

interface Props {
  sellers: BrandData[];
}

export default function BrandsTable({ sellers }: Props) {
  const [limits, setLimits] = useState(
    sellers.reduce((acc, seller) => {
      acc[seller.sellerEmail] = seller.productLimit;
      return acc;
    }, {} as Record<string, number>)
  );

  const [popup, setPopup] = useState<{
    open: boolean;
    sellerEmail?: string;
    oldValue?: number;
    newValue?: number;
  }>({ open: false });

  const handleLimitChange = (email: string, value: number) => {
    setLimits((prev) => ({ ...prev, [email]: value }));
  };

  const openPopup = (email: string) => {
    setPopup({
      open: true,
      sellerEmail: email,
      oldValue: sellers.find((s) => s.sellerEmail === email)?.productLimit,
      newValue: limits[email],
    });
  };

  const confirmUpdate = async () => {
    if (popup.sellerEmail && popup.newValue !== undefined) {
      await updateProductLimit(popup.sellerEmail, popup.newValue);
      setLimits((prev) => ({ ...prev, [popup.sellerEmail!]: popup.newValue! }));
    }
    setPopup({ open: false });
  };

  const cancelUpdate = () => setPopup({ open: false });

  return (
    <div className="w-full max-w-full p-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-md">
        <Table aria-label="Brands Table" className="min-w-[700px]">
          <TableHeader>
            <TableColumn>Brand Count</TableColumn>
            <TableColumn>Logo</TableColumn>
            <TableColumn>Owner Name</TableColumn>
            <TableColumn>Owner Email</TableColumn>
            <TableColumn>Products</TableColumn>
            <TableColumn>Product Limit</TableColumn>
            <TableColumn>Action</TableColumn>
          </TableHeader>

          <TableBody
            emptyContent={
              sellers.length === 0 ? "No sellers to display." : undefined
            }
          >
            {sellers.map((seller) => (
              <TableRow key={seller.sellerEmail}>
                <TableCell>{seller.brandCount}</TableCell>
                <TableCell>
                  {seller.ownerLogo ? (
                    <img
                      src={seller.ownerLogo}
                      alt={`${seller.sellerName} logo`}
                      width={50}
                      height={50}
                      className="object-contain rounded-md"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-[50px] h-[50px] text-xs text-gray-500 rounded-md">
                      No Logo
                    </div>
                  )}
                </TableCell>
                <TableCell>{seller.sellerName}</TableCell>
                <TableCell>{seller.sellerEmail}</TableCell>
                <TableCell>{seller.productCount}</TableCell>
                <TableCell>
                  <input
                    type="number"
                    value={limits[seller.sellerEmail]}
                    onChange={(e) =>
                      handleLimitChange(
                        seller.sellerEmail,
                        Number(e.target.value)
                      )
                    }
                    className="border rounded px-2 py-1 w-20 text-center"
                  />
                </TableCell>
                <TableCell>
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => openPopup(seller.sellerEmail)}
                  >
                    Update
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="grid gap-4 md:hidden">
        {sellers.map((seller) => (
          <div key={seller.sellerEmail} className="p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-3 mb-2">
              {seller.ownerLogo ? (
                <img
                  src={seller.ownerLogo}
                  alt={`${seller.sellerName} logo`}
                  width={50}
                  height={50}
                  className="object-contain rounded-md"
                />
              ) : (
                <div className="flex items-center justify-center w-[50px] h-[50px] text-xs text-gray-500 rounded-md">
                  No Logo
                </div>
              )}
              <h2 className="font-semibold text-lg">{seller.brandCount}</h2>
            </div>

            <p className="text-sm text-gray-700">
              <span className="font-medium">Owner:</span> {seller.sellerName}
            </p>
            <p className="text-sm text-gray-700 truncate">
              <span className="font-medium">Email:</span> {seller.sellerEmail}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Products:</span>{" "}
              {seller.productCount}
            </p>
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <span className="font-medium">Product Limit:</span>
              <input
                type="number"
                value={limits[seller.sellerEmail]}
                onChange={(e) =>
                  handleLimitChange(seller.sellerEmail, Number(e.target.value))
                }
                className="border rounded px-2 py-1 w-20 text-center"
              />
              <button
                className="px-2 py-1 bg-blue-500 text-white rounded"
                onClick={() => openPopup(seller.sellerEmail)}
              >
                Update
              </button>
            </p>
          </div>
        ))}
      </div>

      {/* Popup */}
      {popup.open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Update</h3>
            <p>
              Update product limit for <strong>{popup.sellerEmail}</strong>?
            </p>
            <p>
              Old value: <strong>{popup.oldValue}</strong> <br />
              New value:{" "}
              <input
                type="number"
                value={popup.newValue}
                onChange={(e) =>
                  setPopup({ ...popup, newValue: Number(e.target.value) })
                }
                className="border rounded px-2 py-1 w-full text-center mt-1"
              />
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={cancelUpdate}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={confirmUpdate}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
