import reportService from "@/services/ReportService";
import { BaseController } from "./BaseController";

class ReportController extends BaseController {
   public index = this.asyncHandler(async (req, res) => {
      const reports = await reportService.getAllReports();
      return this.sendSuccess(res, reports, 'Lấy báo cáo thành công');
   });
}


export default new ReportController();
