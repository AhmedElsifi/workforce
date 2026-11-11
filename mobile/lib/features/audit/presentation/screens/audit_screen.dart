import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/widgets/app_dropdown_field.dart';
import 'package:workforce_mobile/core/widgets/page_header.dart';
import 'package:workforce_mobile/core/widgets/resource_view.dart';

import '../../cubit/audit_cubit.dart';
import '../../cubit/audit_state.dart';
import '../../data/audit_log_entry.dart';
import '../widgets/audit_log_tile.dart';
import '../widgets/audit_pagination_bar.dart';

const _categories = ['employee', 'department', 'leave', 'attendance', 'auth', 'system'];

class AuditScreen extends StatefulWidget {
  const AuditScreen({super.key});

  @override
  State<AuditScreen> createState() => _AuditScreenState();
}

class _AuditScreenState extends State<AuditScreen> {
  @override
  void initState() {
    super.initState();
    context.read<AuditCubit>().load();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuditCubit, AuditState>(
      builder: (context, state) {
        return RefreshIndicator(
          onRefresh: () => context.read<AuditCubit>().load(),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                PageHeader(
                  eyebrow: 'Org Controls',
                  title: 'System Audit',
                  action: IconButton(
                    icon: const Icon(Icons.refresh),
                    onPressed: () => context.read<AuditCubit>().load(),
                  ),
                ),
                const SizedBox(height: 16),
                AppDropdownField<String?>(
                  label: 'Category',
                  value: state.category,
                  items: [null, ..._categories],
                  itemLabel: (c) => c == null ? 'All' : c[0].toUpperCase() + c.substring(1),
                  onChanged: (value) => context.read<AuditCubit>().setCategory(value),
                ),
                const SizedBox(height: 16),
                ResourceView<AuditPage>(
                  resource: state.page,
                  emptyMessage: 'No audit entries found.',
                  emptyIcon: Icons.security_outlined,
                  onRetry: () => context.read<AuditCubit>().load(),
                  isEmpty: (data) => data.logs.isEmpty,
                  builder: (context, data) => Column(
                    children: [
                      ...data.logs.map((e) => AuditLogTile(entry: e)),
                      const SizedBox(height: 8),
                      AuditPaginationBar(
                        currentPage: data.page,
                        totalPages: data.pages,
                        onPageChanged: (p) => context.read<AuditCubit>().goToPage(p),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
