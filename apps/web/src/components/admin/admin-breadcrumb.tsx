import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { getAdminNavTitle } from "./admin-sidebar";

export const AdminBreadcrumb = ({ title }: { title?: string }) => {
  const location = useLocation();
  const currentTitle = title ?? getAdminNavTitle(location.pathname);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden sm:inline-flex">
          <Link
            className="transition-colors hover:text-foreground"
            to="/admin/appointments"
          >
            Admin
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden sm:inline-flex" />
        <BreadcrumbItem>
          <BreadcrumbPage>{currentTitle}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
