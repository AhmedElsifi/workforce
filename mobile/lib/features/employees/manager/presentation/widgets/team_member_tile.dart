import 'package:flutter/material.dart';
import 'package:workforce_mobile/core/theme/app_colors.dart';
import 'package:workforce_mobile/core/utils/formatters.dart';
import 'package:workforce_mobile/core/widgets/avatar_initials.dart';
import 'package:workforce_mobile/core/widgets/status_pill.dart';

import '../../data/team_member.dart';

class TeamMemberTile extends StatelessWidget {
  const TeamMemberTile({super.key, required this.member, required this.onToggleStatus});

  final TeamMember member;
  final VoidCallback onToggleStatus;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AvatarInitials(initials: Formatters.initialsOf(member.fname, member.lname)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(Formatters.titleCase(member.fullName), style: const TextStyle(fontWeight: FontWeight.w700)),
                  Text(member.email, style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
                  if (member.position != null)
                    Text(member.position!, style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      StatusPill.employmentStatus(member.employmentStatus),
                      const SizedBox(width: 8),
                      Text(Formatters.currency(member.salary), style: const TextStyle(fontSize: 12)),
                    ],
                  ),
                ],
              ),
            ),
            OutlinedButton(
              style: OutlinedButton.styleFrom(
                foregroundColor: member.isActive ? AppColors.danger : AppColors.success,
                side: BorderSide(color: member.isActive ? AppColors.danger : AppColors.success),
              ),
              onPressed: onToggleStatus,
              child: Text(member.isActive ? 'Deactivate' : 'Activate'),
            ),
          ],
        ),
      ),
    );
  }
}
