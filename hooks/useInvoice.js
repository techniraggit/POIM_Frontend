'use client'
import { useGlobalContext } from "@/app/Context/UserContext";

const useInvoice = (invoice) => {
  let approval_enabled = false;
  const { user } = useGlobalContext();

  if(invoice?.purchase_order?.po_type === 'material' || invoice?.purchase_order?.po_type === 'rental') {
    if(user?.role === 'supervisor') {
        approval_enabled = !invoice?.site_superintendent_approved
    } else if(user?.role === 'project manager') {
        approval_enabled = !invoice?.pm_approved
    } else if(user?.role === 'department manager') {
        approval_enabled = !invoice?.dm_approved
    }
  } else if(invoice?.purchase_order?.po_type === 'subcontractor') {
    if(user?.role === 'project manager') {
        approval_enabled = !invoice?.pm_approved
    } else if(user?.role === 'department manager') {
        approval_enabled = !invoice?.dm_approved
    }
  } else {
    approval_enabled = false;
  }
  return { approval_enabled }
}

export default useInvoice;
