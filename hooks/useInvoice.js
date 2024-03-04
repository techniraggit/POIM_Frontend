'use client'
import { useGlobalContext } from "@/app/Context/UserContext";

const useInvoice = (invoice) => {
  let approval_enabled = false;
  const { user } = useGlobalContext();

  if(invoice?.purchase_order?.po_type === 'material' || invoice?.purchase_order?.po_type === 'rental' 
  || invoice?.purchase_order?.po_type === 'subcontractor'
  ) {
    if(invoice?.po_creator) {
        approval_enabled = invoice?.po_creator_approval_status === 'pending';
    } else if(user?.role === 'project manager') {
        approval_enabled = invoice?.po_creator_approval_status === 'approved' && invoice?.pm_approval_status  === 'pending';
    } else if(user?.role === 'department manager') {
        approval_enabled = invoice?.po_creator_approval_status === 'approved' && invoice?.pm_approval_status === 'approved' && invoice?.dm_approval_status === 'pending';
    }
  } else {
    approval_enabled = false;
  }
  return { approval_enabled }
}

export default useInvoice;