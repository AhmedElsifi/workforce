import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/utils/resource.dart';
import 'package:workforce_mobile/core/widgets/confirm_dialog.dart';
import 'package:workforce_mobile/core/widgets/page_header.dart';
import 'package:workforce_mobile/core/widgets/resource_view.dart';

import '../../cubit/team_cubit.dart';
import '../../data/team_member.dart';
import '../widgets/team_filter_bar.dart';
import '../widgets/team_member_tile.dart';

class TeamScreen extends StatefulWidget {
  const TeamScreen({super.key});

  @override
  State<TeamScreen> createState() => _TeamScreenState();
}

class _TeamScreenState extends State<TeamScreen> {
  TeamStatusFilter _filter = TeamStatusFilter.all;
  String _search = '';

  @override
  void initState() {
    super.initState();
    context.read<TeamCubit>().load();
  }

  List<TeamMember> _applyFilters(List<TeamMember> members) {
    return members.where((m) {
      final matchesFilter = switch (_filter) {
        TeamStatusFilter.all => true,
        TeamStatusFilter.active => m.isActive,
        TeamStatusFilter.inactive => !m.isActive,
      };
      if (!matchesFilter) return false;
      if (_search.isEmpty) return true;
      final q = _search.toLowerCase();
      return m.fullName.toLowerCase().contains(q) ||
          m.email.toLowerCase().contains(q) ||
          (m.position ?? '').toLowerCase().contains(q);
    }).toList();
  }

  Future<void> _onToggle(TeamMember member) async {
    final confirmed = await showConfirmDialog(
      context,
      title: member.isActive ? 'Deactivate employee' : 'Activate employee',
      message:
          '${member.isActive ? 'Deactivate' : 'Activate'} ${member.fullName}?',
      confirmLabel: member.isActive ? 'Deactivate' : 'Activate',
      danger: member.isActive,
    );
    if (!confirmed || !mounted) return;
    final error = await context.read<TeamCubit>().toggleStatus(member);
    if (!mounted) return;
    if (error != null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error)));
    }
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: () => context.read<TeamCubit>().load(),
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const PageHeader(eyebrow: 'Oversight', title: 'Department Employees'),
            const SizedBox(height: 16),
            TeamFilterBar(
              filter: _filter,
              onFilterChanged: (f) => setState(() => _filter = f),
              onSearchChanged: (q) => setState(() => _search = q),
            ),
            const SizedBox(height: 16),
            BlocBuilder<TeamCubit, Resource<List<TeamMember>>>(
              builder: (context, resource) {
                return ResourceView<List<TeamMember>>(
                  resource: resource,
                  emptyMessage: 'No employees match your criteria.',
                  emptyIcon: Icons.person_off_outlined,
                  onRetry: () => context.read<TeamCubit>().load(),
                  isEmpty: (data) => _applyFilters(data).isEmpty,
                  builder: (context, data) {
                    final members = _applyFilters(data);
                    return Column(
                      children: members
                          .map((m) => TeamMemberTile(member: m, onToggleStatus: () => _onToggle(m)))
                          .toList(),
                    );
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
