import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChildren,
} from '@angular/core';

import {IContestsState} from '../contest-select/contest-select.component';
import {formatUsers} from '../monitor.service';
import {IMonitorApi, ITableProblem, TableType, ITableUser} from '../monitor.types';
import {nameCompare, problemCompare, totalScoreCompare} from '../table-sort';
import {TableSortService} from '../table-sort.service';

interface ITooltipData {
    contestName: string;
    fullname: string;
    summary: string;
}

interface ITooltipPosition {
    top: number;
    left: number;
    orientation: 'right' | 'left';
}

interface ISortState {
    fieldId: string | number;
    reverse: boolean;
}

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit, OnDestroy {
    currentProblems: ITableProblem[];
    currentUsers: ITableUser[];
    isUpdating = false;

    @Input() problems: ITableProblem[];
    @Input() users: ITableUser[];
    @Input() data: IMonitorApi;

    @Input()
    set contestsState(state: IContestsState) {
        if (!!state) {
            this.isUpdating = true;
            setTimeout(() => {
                this.recalculateContests(state);
            }, 100);
        }
    }

    @Input() type: TableType = TableType.IOI;

    @ViewChildren('col') private cols: QueryList<
        ElementRef<HTMLTableCellElement>
    > = new QueryList();

    isScrolled = false;

    tooltipData: ITooltipData | null = null;
    tooltipPosition: ITooltipPosition = {top: 0, left: 0, orientation: 'left'};

    sortState: ISortState = {
        fieldId: 'totalScore',
        reverse: false,
    };

    constructor(
        private sortTableService: TableSortService,
        private cd: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.currentProblems = this.makeDeepCopyOf(this.problems);
        this.currentUsers = this.makeDeepCopyOf(this.users);

        if (this.sortTableService.isSortSaved && this.getSortState()) {
            const state = this.getSortState();

            this.sortState = {
                fieldId: state.fieldId,
                reverse: !state.reverse,
            };

            this.sortTable(this.sortState.fieldId);
        }
    }

    ngOnDestroy() {
        this.sortTableService.isSortSaved = false;
    }

    @HostListener('mousemove', ['$event']) onMouseMove($event: MouseEvent) {
        const colHover = $event.target
            ? (($event.target as HTMLElement).closest('td, th') as HTMLTableCellElement)
            : null;

        this.cols.forEach(col => {
            const status = col.nativeElement.querySelector('app-status');

            col.nativeElement.classList.remove('col_hover');

            if (
                colHover &&
                !colHover.className.includes('col_head') &&
                (col.nativeElement.parentNode === colHover.parentNode ||
                    (col.nativeElement.cellIndex === colHover.cellIndex &&
                        !colHover.className.includes('col_sticky')))
            ) {
                col.nativeElement.classList.add('col_highlighted');

                if (status) {
                    status.classList.add('_highlighted');
                }
            } else {
                col.nativeElement.classList.remove('col_highlighted', 'col_hover');

                if (status) {
                    status.classList.remove('_highlighted');
                }
            }
        });

        if (colHover) {
            colHover.classList.add('col_hover');
        }
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.cols.forEach(col => {
            const status = col.nativeElement.querySelector('app-status');

            col.nativeElement.classList.remove('col_highlighted', 'col_hover');

            if (status) {
                status.classList.remove('_highlighted');
            }
        });
    }

    onScroll(val: number) {
        this.isScrolled = Boolean(val);
    }

    showTooltip(e: MouseEvent, data: ITooltipData) {
        const tooltipOffset = 18;
        const tooltipWidth = 288;
        const button = e.target ? (e.target as HTMLElement).closest('button') : null;

        if (!button || !data) {
            this.hideTooltip();

            return;
        }

        const {top, left} = button.getBoundingClientRect();
        const offsetLeft = left + tooltipOffset;
        const toRight = offsetLeft + tooltipWidth > window.innerWidth;

        const finalPosition: ITooltipPosition = {
            top: top + button.offsetHeight - 8,
            left: toRight
                ? left + button.offsetWidth - tooltipOffset - tooltipWidth
                : offsetLeft,
            orientation: toRight ? 'right' : 'left',
        };

        this.tooltipPosition = finalPosition;
        this.tooltipData = data;
    }

    hideTooltip() {
        this.tooltipData = null;
    }

    sortTable(id: string | number) {
        const reverse = id === this.sortState.fieldId && !this.sortState.reverse;

        switch (id) {
            case 'name':
                this.currentUsers.sort(nameCompare(reverse));
                break;
            case 'totalScore':
                this.currentUsers.sort(totalScoreCompare(this.type, reverse));
                break;
            default:
                this.currentUsers.sort(
                    problemCompare(
                        this.currentProblems.findIndex(problem => problem.id === id),
                        reverse,
                    ),
                );
        }

        this.sortState = {
            fieldId: id,
            reverse,
        };

        this.setSortState(this.sortState);
    }

    isReversed(id: string | number): boolean {
        return this.sortState.fieldId === id && this.sortState.reverse;
    }

    formatUserInfo(user: ITableUser): string {
        if (!user) {
            return '';
        }

        if (user.school === 'school' || !user.school) {
            return user.city;
        }

        return [user.school, user.city].join(', ');
    }

    private setSortState(state: ISortState) {
        localStorage.setItem('sortState', JSON.stringify(state));
    }

    private getSortState(): ISortState {
        return JSON.parse(localStorage.getItem('sortState')) as ISortState;
    }

    private makeDeepCopyOf(entity: any): any {
        return JSON.parse(JSON.stringify(entity));
    }

    private recalculateContests(state: IContestsState) {
        const chosenContests = Object.keys(state)
            .filter(id => !!state[id])
            .map(id => +id);

        this.currentProblems = this.makeDeepCopyOf(
            this.problems.filter(problem => chosenContests.includes(problem.contestId)),
        );

        this.currentUsers = formatUsers(this.data, this.currentProblems);
        this.isUpdating = false;
        this.cd.markForCheck();
    }
}
