"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeroSlide } from '@prisma/client';
import { deleteHeroSlideAction } from '@/actions/hero.action';
import { toast } from 'sonner';
import { Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { EditInfoPopup } from './EditInfoPopup';
import { EditImagePopup } from './EditImagePopup';
import { DeleteConfirmPopup } from './DeleteConfirmPopup';
import { SlideDetailsPopup } from './SlideDetailsPopup';


interface CarouselClientProps {
  slides: HeroSlide[];
}

export const CarouselClient: React.FC<CarouselClientProps> = ({ slides }) => {
  const router = useRouter();
  const t = useTranslations("CarouselManagement");
  
  // States للـ Popups
  const [slideToEdit, setSlideToEdit] = useState<HeroSlide | null>(null);
  const [slideToDelete, setSlideToDelete] = useState<HeroSlide | null>(null);
  const [selectedSlide, setSelectedSlide] = useState<HeroSlide | null>(null);
  
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [showEditImage, setShowEditImage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // معالجة الحذف
  const handleDelete = async () => {
    if (!slideToDelete) return;

    setDeleteLoading(true);
    try {
      const result = await deleteHeroSlideAction(slideToDelete.id);
      if (result.success) {
        toast.success(t('delete_success'));
        router.refresh();
        setShowDeleteConfirm(false);
        setSlideToDelete(null);
      } else {
        toast.error(t('delete_failed'));
      }
    } catch (error) {
      toast.error(t('delete_failed'));
    } finally {
      setDeleteLoading(false);
    }
  };

  // معالجة التعديل
  const handleEditInfo = (slide: HeroSlide, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSlideToEdit(slide);
    setShowEditInfo(true);
  };

  const handleEditImage = (slide: HeroSlide, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSlideToEdit(slide);
    setShowEditImage(true);
  };

  const handleEditSuccess = () => {
    setShowEditInfo(false);
    setShowEditImage(false);
    setSlideToEdit(null);
    router.refresh();
  };

  // معالجة التفاصيل
  const showSlideDetails = (slide: HeroSlide) => {
    setSelectedSlide(slide);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedSlide(null);
  };

  // معالجة تأكيد الحذف
  const confirmDelete = (slide: HeroSlide, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSlideToDelete(slide);
    setShowDeleteConfirm(true);
  };

  return (
    <>
      <div className="bg-card rounded-lg shadow-md">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  {t("table_header_image")}
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  {t("table_header_title")}
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  {t("table_header_status")}
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  {t("table_header_actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {slides.length > 0 ? (
                slides.map((slide) => (
                  <tr 
                    key={slide.id} 
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => showSlideDetails(slide)}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <img 
                          src={slide.imageUrl} 
                          alt={slide.title} 
                          className="rounded-md object-cover h-12 w-20"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-medium text-sm">
                      <div className="max-w-[150px] truncate" title={slide.title}>
                        {slide.title}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        slide.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {slide.isActive ? t("status_active") : t("status_inactive")}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={(e) => handleEditInfo(slide, e)} 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={t("edit_info")}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={(e) => handleEditImage(slide, e)} 
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title={t("edit_image")}
                        >
                          <ImageIcon size={16} />
                        </button>
                        <button 
                          onClick={(e) => confirmDelete(slide, e)} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title={t("delete")}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-muted-foreground">
                    {t("no_slides")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden space-y-3 p-4">
          {slides.length > 0 ? (
            slides.map((slide) => (
              <div 
                key={slide.id} 
                className="bg-background border border-border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => showSlideDetails(slide)}
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={slide.imageUrl} 
                    alt={slide.title} 
                    className="rounded-md object-cover h-10 w-16 flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate" title={slide.title}>
                      {slide.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      slide.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {slide.isActive ? t("status_active") : t("status_inactive")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={(e) => handleEditInfo(slide, e)} 
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title={t("edit_info")}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={(e) => handleEditImage(slide, e)} 
                      className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                      title={t("edit_image")}
                    >
                      <ImageIcon size={16} />
                    </button>
                    <button 
                      onClick={(e) => confirmDelete(slide, e)} 
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title={t("delete")}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t("no_slides")}
            </div>
          )}
        </div>
      </div>

      {/* Popups */}
      <SlideDetailsPopup
        slide={selectedSlide}
        isOpen={showDetails}
        onClose={closeDetails}
        onEditInfo={handleEditInfo}
        onEditImage={handleEditImage}
        onDelete={confirmDelete}
      />

      <EditInfoPopup
        slide={slideToEdit}
        isOpen={showEditInfo}
        onClose={() => setShowEditInfo(false)}
        onSuccess={handleEditSuccess}
      />

      <EditImagePopup
        slide={slideToEdit}
        isOpen={showEditImage}
        onClose={() => setShowEditImage(false)}
        onSuccess={handleEditSuccess}
      />

      <DeleteConfirmPopup
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title={slideToDelete?.title || ''}
        loading={deleteLoading}
      />
    </>
  );
};