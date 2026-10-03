import 'package:flutter/material.dart';
import 'package:workforce_mobile/core/theme/app_colors.dart';
import 'package:workforce_mobile/core/utils/formatters.dart';
import 'package:workforce_mobile/core/widgets/status_pill.dart';

import 'package:workforce_mobile/features/leave_requests/data/leave_request.dart';

class MyLeaveRequestTile extends StatelessWidget {
  const MyLeaveRequestTile({super.key, required this.request});

  final LeaveRequest request;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                StatusPill.leaveType(request.leaveType),
                StatusPill.leaveStatus(request.status),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              Formatters.dateRange(request.startDate, request.endDate),
              style: const TextStyle(fontWeight: FontWeight.w700),
            ),
            if (request.reason.isNotEmpty) ...[
              const SizedBox(height: 4),
              Text(request.reason, style: const TextStyle(color: AppColors.textMuted)),
            ],
            if (request.managerComment.isNotEmpty) ...[
              const SizedBox(height: 4),
              Text(
                'Manager note: ${request.managerComment}',
                style: const TextStyle(color: AppColors.textFaint, fontStyle: FontStyle.italic),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
