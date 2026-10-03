import 'package:flutter/material.dart';

enum TeamStatusFilter { all, active, inactive }

class TeamFilterBar extends StatelessWidget {
  const TeamFilterBar({
    super.key,
    required this.filter,
    required this.onFilterChanged,
    required this.onSearchChanged,
  });

  final TeamStatusFilter filter;
  final ValueChanged<TeamStatusFilter> onFilterChanged;
  final ValueChanged<String> onSearchChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          onChanged: onSearchChanged,
          decoration: const InputDecoration(
            hintText: 'Search by name, email, or position',
            prefixIcon: Icon(Icons.search),
          ),
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          children: TeamStatusFilter.values.map((value) {
            return ChoiceChip(
              label: Text(_label(value)),
              selected: filter == value,
              onSelected: (_) => onFilterChanged(value),
            );
          }).toList(),
        ),
      ],
    );
  }

  String _label(TeamStatusFilter value) => switch (value) {
        TeamStatusFilter.all => 'All',
        TeamStatusFilter.active => 'Active',
        TeamStatusFilter.inactive => 'Inactive',
      };
}
