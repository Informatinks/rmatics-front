import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {IProblem, ISubmission} from '../../../core/stores/contest/types/contest.types';
import {ILanguage} from '../../../shared/constants';
import {UploadComponent} from '../../../ui/controls/upload/upload.component';
import {formatBytes} from '../../../utils/formatBytes';
import {AlertService} from '../../../shared/services/alert.service';
import {MessageComponent} from '../../../ui/message/message.component';

@Component({
    selector: 'app-contest-task',
    templateUrl: './contest-task.component.html',
    styleUrls: ['./contest-task.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestTaskComponent implements OnInit, OnDestroy {
    @ViewChild('upload') upload!: UploadComponent;

    @Input() problem: IProblem = null;
    @Input() contestId: number = null;
    @Input() fileError = '';
    @Input() name = '';
    @Input() timeLimit = 0;
    @Input() memoryLimit = 0;
    @Input() input: string[] = [];
    @Input() correct: string[] = [];
    @Input() content = '';
    @Input() submissions: ISubmission[] = [];
    @Input() isSubmissionsFetching = false;
    @Input() languages: ILanguage[];
    @Input() selectedLanguage: ILanguage;

    @Output() selectFile = new EventEmitter();
    @Output() addSubmission = new EventEmitter();
    @Output() getSubmissions = new EventEmitter<number>();
    @Output() openSubmission = new EventEmitter();
    @Output() pass = new EventEmitter();
    @Output() selectedLanguageChange = new EventEmitter<ILanguage>();

    code = '';
    showFileLoader = true;
    selectedFile?: File;
    formatBytes = formatBytes;
    problemId: number;

    constructor(private route: ActivatedRoute, private alertService: AlertService) {}

    ngOnInit() {
        this.problemId = Number(this.route.snapshot.paramMap.get('problemId'));
        this.contestId = Number(this.route.snapshot.paramMap.get('contestId'));

        const obj = JSON.parse(localStorage.getItem('code'));

        if (obj !== null && obj[this.contestId] && obj[this.contestId][this.problemId]) {
            this.code = obj[this.contestId][this.problemId];
        }
    }

    ngOnDestroy() {
        this.assertCode();
    }

    get minDataLines() {
        return Math.max(this.input.length, this.correct.length);
    }

    select(file: File) {
        if (file !== undefined) {
            this.selectFile.emit();
        }

        this.selectedFile = file;
    }

    passSolution() {
        if (this.showFileLoader && !this.selectedFile) {
            this.alertService.showNotification(MessageComponent, {
                status: 'error',
                text: "Submission shouldn't be empty",
            });

            return;
        }

        this.addSubmission.emit({
            file: this.showFileLoader
                ? this.selectedFile
                : new File([new Blob([this.code])], 'solution.code'),
            languageId: this.selectedLanguage.code,
        });

        this.code = '';
        this.assertCode();
    }

    onSelectedLanguageChanged(lang: ILanguage) {
        this.selectedLanguageChange.emit(lang);
    }

    private assertCode() {
        let obj = JSON.parse(localStorage.getItem('code'));

        obj = obj || {};
        obj[this.contestId] = obj[this.contestId] || {};
        obj[this.contestId][this.problemId] = this.code;

        localStorage.setItem('code', JSON.stringify(obj));
    }
}
