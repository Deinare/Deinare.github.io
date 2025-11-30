// Функция для работы с дробями
class Fraction {
    constructor(numerator, denominator = 1) {
        if (denominator === 0) throw new Error("Denominator cannot be zero");

        const gcd = this.gcd(Math.abs(numerator), Math.abs(denominator));
        this.numerator = numerator / gcd;
        this.denominator = denominator / gcd;

        if (this.denominator < 0) {
            this.numerator = -this.numerator;
            this.denominator = -this.denominator;
        }
    }

    gcd(a, b) {
        return b === 0 ? a : this.gcd(b, a % b);
    }

    add(other) {
        return new Fraction(
            this.numerator * other.denominator + other.numerator * this.denominator,
            this.denominator * other.denominator
        );
    }

    subtract(other) {
        return new Fraction(
            this.numerator * other.denominator - other.numerator * this.denominator,
            this.denominator * other.denominator
        );
    }

    multiply(other) {
        return new Fraction(
            this.numerator * other.numerator,
            this.denominator * other.denominator
        );
    }

    divide(other) {
        return new Fraction(
            this.numerator * other.denominator,
            this.denominator * other.numerator
        );
    }

    equals(other) {
        return this.numerator === other.numerator && this.denominator === other.denominator;
    }

    isZero() {
        return this.numerator === 0;
    }

    isPositive() {
        return this.numerator > 0;
    }

    isNegative() {
        return this.numerator < 0;
    }

    toDecimal() {
        return this.numerator / this.denominator;
    }

    toString() {
        if (this.denominator === 1) return this.numerator.toString();
        return `${this.numerator}/${this.denominator}`;
    }

    clone() {
        return new Fraction(this.numerator, this.denominator);
    }
}

class FractionalLinearTransformer {
    constructor() {
        this.transformationSteps = [];
        this.transformedProblem = null;
        this.simplexIterations = [];
        this.finalSimplexIterations = [];
    }

    transform(numerator, denominator, constraints, varsCount) {
        console.log("Начало преобразования...");
        this.transformationSteps = [];
        this.simplexIterations = [];
        this.finalSimplexIterations = [];
        const m = constraints.length;
        const n = varsCount;

        console.log("n:", n, "m:", m);

        try {
            const transformedObjective = this.transformObjective(numerator, n);
            this.transformationSteps.push({
                step: "Преобразованная целевая функция",
                description: this.formatTransformedObjective(transformedObjective)
            });

            const transformedConstraints = this.transformConstraints(constraints, n, m);
            this.transformationSteps.push({
                step: "Преобразованные ограничения",
                description: this.formatTransformedConstraints(transformedConstraints, m)
            });

            const additionalConstraint = this.createAdditionalConstraint(denominator, n);
            this.transformationSteps.push({
                step: "Дополнительное ограничение",
                description: this.formatAdditionalConstraint(additionalConstraint)
            });

            this.transformedProblem = {
                objective: transformedObjective,
                constraints: transformedConstraints,
                additionalConstraint: additionalConstraint,
                variablesCount: n + 1
            };

            console.log("Преобразование завершено успешно");
            return this.transformedProblem;

        } catch (error) {
            console.error("Ошибка при преобразовании:", error);
            return null;
        }
    }

    transformObjective(numerator, n) {
        return {
            coeffs: numerator.coeffs.map(c => new Fraction(c)),
            constant: new Fraction(numerator.constant)
        };
    }

    formatTransformedObjective(objective) {
        let html = '<p>Z = ';

        const parts = [];

        objective.coeffs.forEach((c, i) => {
            if (!c.isZero()) {
                const sign = c.isPositive() ? '+' : '';
                parts.push(`${sign}${c.toString()}y<sub>${i + 1}</sub>`);
            }
        });

        if (!objective.constant.isZero()) {
            const sign = objective.constant.isPositive() ? '+' : '';
            parts.push(`${sign}${objective.constant.toString()}y₀`);
        }

        let equation = parts.join(' ');
        if (equation.startsWith('+')) equation = equation.substring(1);
        if (equation === '') equation = '0';

        html += equation + ' → max</p>';

        return html;
    }

    transformConstraints(constraints, n, m) {
        const transformed = [];

        for (let i = 0; i < m; i++) {
            const constraint = constraints[i];
            transformed.push({
                coeffs: constraint.coeffs.map(c => new Fraction(c)),
                constant: new Fraction(-constraint.value),
                rhs: new Fraction(0)
            });
        }

        return transformed;
    }

    formatTransformedConstraints(constraints, m) {
        let html = '';

        constraints.forEach((constraint, i) => {
            html += '<p>';

            const parts = [];

            constraint.coeffs.forEach((c, j) => {
                if (!c.isZero()) {
                    const sign = c.isPositive() ? '+' : '';
                    parts.push(`${sign}${c.toString()}y<sub>${j + 1}</sub>`);
                }
            });

            if (!constraint.constant.isZero()) {
                const sign = constraint.constant.isPositive() ? '+' : '';
                parts.push(`${sign}${constraint.constant.toString()}y₀`);
            }

            let equation = parts.join(' ');
            if (equation.startsWith('+')) equation = equation.substring(1);
            if (equation === '') equation = '0';

            html += equation + ` = ${constraint.rhs.toString()}`;
            html += '</p>';
        });

        return html;
    }

    createAdditionalConstraint(denominator, n) {
        return {
            coeffs: denominator.coeffs.map(c => new Fraction(c)),
            constant: new Fraction(denominator.constant),
            rhs: new Fraction(1)
        };
    }

    formatAdditionalConstraint(constraint) {
        let html = '<p>';

        const parts = [];

        constraint.coeffs.forEach((c, i) => {
            if (!c.isZero()) {
                const sign = c.isPositive() ? '+' : '';
                parts.push(`${sign}${c.toString()}y<sub>${i + 1}</sub>`);
            }
        });

        if (!constraint.constant.isZero()) {
            const sign = constraint.constant.isPositive() ? '+' : '';
            parts.push(`${sign}${constraint.constant.toString()}y₀`);
        }

        let equation = parts.join(' ');
        if (equation.startsWith('+')) equation = equation.substring(1);
        if (equation === '') equation = '0';

        html += equation + ` = ${constraint.rhs.toString()}`;
        html += '</p>';

        return html;
    }

    // ГЛАВНОЕ: метод для получения коэффициента из целевой функции
    getObjectiveCoefficient(varName) {
        const objective = this.transformedProblem.objective;

        if (varName === 'y₀') {
            return objective.constant.clone();
        } else if (varName.startsWith('y')) {
            const index = parseInt(varName.substring(1)) - 1;
            if (index >= 0 && index < objective.coeffs.length) {
                return objective.coeffs[index].clone();
            }
        }
        // Для искусственной переменной используем 'M'
        return 'M';
    }

    createSimplexTable(numerator, includeDelta = true) {
        if (!this.transformedProblem) {
            console.error("Нет преобразованной задачи");
            return null;
        }

        const problem = this.transformedProblem;
        const n = problem.variablesCount - 1;
        const m = problem.constraints.length;

        console.log("Создание симплекс-таблицы: n=", n, "m=", m);

        const table = [];
        const header = ['Баз', 'Cбаз', 'B', 'y₀'];
        for (let j = 1; j <= n; j++) header.push(`y${j}`);
        header.push('a₁');

        // Базисные переменные
        const basisVars = [];
        const basisCoeffs = [];

        // Начальный базис: последние m переменных + искусственная
        for (let i = 0; i < m; i++) {
            const basisIndex = n - m + i + 1;
            const basisVar = `y${basisIndex}`;
            basisVars.push(basisVar);
            // ВАЖНО: Cбаз берется ИЗ ЦЕЛЕВОЙ ФУНКЦИИ
            basisCoeffs.push(this.getObjectiveCoefficient(basisVar));
        }

        // Искусственная переменная
        basisVars.push('a₁');
        basisCoeffs.push('M'); // M-метод

        console.log("Базисные переменные:", basisVars);
        console.log("Коэффициенты базиса (Cбаз):", basisCoeffs);

        // Заполняем таблицу ограничениями - ВАЖНО: в столбец Cбаз выводим коэффициенты из целевой функции
        for (let i = 0; i < m; i++) {
            const constraint = problem.constraints[i];
            const row = [
                basisVars[i],
                basisCoeffs[i], // ВАЖНО: это коэффициент из целевой функции
                new Fraction(0)
            ];

            // Столбец y₀
            row.push(constraint.constant.clone());

            // Столбцы y1, y2, ...
            constraint.coeffs.forEach(coeff => {
                row.push(coeff.clone());
            });

            // Столбец искусственной переменной
            row.push(new Fraction(0));

            table.push(row);
        }

        // Строка для дополнительного ограничения (искусственная переменная)
        const additionalRow = [
            'a₁',
            'M', // ВАЖНО: M для искусственной переменной
            new Fraction(1)
        ];
        additionalRow.push(problem.additionalConstraint.constant.clone());
        problem.additionalConstraint.coeffs.forEach(coeff => {
            additionalRow.push(coeff.clone());
        });
        additionalRow.push(new Fraction(1));

        table.push(additionalRow);

        let deltaRow = null;
        if (includeDelta) {
            deltaRow = this.calculateDeltaRow(table, basisCoeffs, n, m, problem.objective);
        }

        console.log("Симплекс-таблица создана успешно");

        return {
            table: table,
            deltaRow: deltaRow,
            header: header,
            basis: basisVars,
            basisCoeffs: basisCoeffs
        };
    }

    calculateDeltaRow(table, basisCoeffs, n, m, objective) {
        const deltaRow = ['Δ', '', new Fraction(0)];

        // Расчет для столбца B (индекс 2) - используем фиксированные Cбаз из целевой функции
        let sumB = new Fraction(0);
        for (let row = 0; row < table.length; row++) {
            const cell = table[row][2]; // Столбец B
            const basisCoeff = basisCoeffs[row]; // Cбаз из целевой функции

            if (cell instanceof Fraction) {
                if (basisCoeff === 'M') {
                    // Для M-метода: M * значение
                    sumB = sumB.add(new Fraction(1000000).multiply(cell));
                } else if (basisCoeff instanceof Fraction) {
                    sumB = sumB.add(basisCoeff.multiply(cell));
                }
            }
        }
        deltaRow[2] = sumB;

        // Расчет для остальных столбцов (y₀, y1, y2, ...) - используем фиксированные Cбаз
        for (let col = 3; col < table[0].length; col++) {
            let sum = new Fraction(0);

            for (let row = 0; row < table.length; row++) {
                const cell = table[row][col];
                const basisCoeff = basisCoeffs[row]; // Cбаз из целевой функции

                if (cell instanceof Fraction) {
                    if (basisCoeff === 'M') {
                        sum = sum.add(new Fraction(1000000).multiply(cell));
                    } else if (basisCoeff instanceof Fraction) {
                        sum = sum.add(basisCoeff.multiply(cell));
                    }
                }
            }

            // Вычитаем коэффициент из целевой функции
            let objectiveCoeff;
            if (col === 3) { // Столбец y₀
                objectiveCoeff = objective.constant;
            } else if (col >= 4 && col < 4 + n) { // Столбцы y1, y2, ...
                const varIndex = col - 4;
                objectiveCoeff = varIndex < objective.coeffs.length ?
                    objective.coeffs[varIndex] : new Fraction(0);
            } else {
                objectiveCoeff = new Fraction(0);
            }

            deltaRow.push(sum.subtract(objectiveCoeff));
        }

        return deltaRow;
    }

    formatSimplexTable(tableData) {
        if (!tableData) return '<p>Ошибка: нет данных таблицы</p>';

        let html = '<div class="simplex-table"><table>';

        html += '<tr>';
        tableData.header.forEach(header => {
            html += `<th>${header}</th>`;
        });
        html += '</tr>';

        tableData.table.forEach((row, i) => {
            html += '<tr>';
            row.forEach((cell, j) => {
                let cellValue;
                if (cell instanceof Fraction) {
                    cellValue = cell.toString();
                } else if (j === 1 && cell === 'M') { // ВАЖНО: правильно отображаем M в столбце Cбаз
                    cellValue = 'M';
                } else {
                    cellValue = String(cell);
                }
                html += `<td>${cellValue}</td>`;
            });
            html += '</tr>';
        });

        if (tableData.deltaRow) {
            html += '<tr>';
            tableData.deltaRow.forEach(cell => {
                let cellValue;
                if (cell instanceof Fraction) {
                    cellValue = cell.toString();
                } else {
                    cellValue = String(cell);
                }
                html += `<td>${cellValue}</td>`;
            });
            html += '</tr>';
        }

        html += '</table></div>';
        return html;
    }

    performSimplexForY0(numerator) {
        if (!this.transformedProblem) {
            console.error("Нет преобразованной задачи для симплекс-метода");
            return null;
        }

        console.log("Запуск симплекс-метода для y₀");

        const problem = this.transformedProblem;
        const n = problem.variablesCount - 1;
        const m = problem.constraints.length;

        let tableData = this.createSimplexTable(numerator, false);
        if (!tableData) {
            console.error("Не удалось создать симплекс-таблицу");
            return null;
        }

        this.simplexIterations.push({
            step: "Начальная таблица",
            table: this.copyTable(tableData.table),
            deltaRow: tableData.deltaRow ? this.copyDeltaRow(tableData.deltaRow) : null,
            basis: [...tableData.basis],
            basisCoeffs: [...tableData.basisCoeffs],
            header: [...tableData.header],
            explanation: "Начальная симплекс-таблица с базисными переменными y₃,y₄,y₅,a₁"
        });

        let table = tableData.table;
        let basis = tableData.basis;
        let basisCoeffs = tableData.basisCoeffs;

        const pivotCol = 3; // Столбец y₀

        let minRatio = null;
        let pivotRow = -1;

        for (let i = 0; i < table.length; i++) {
            const y0Val = table[i][pivotCol];
            const bVal = table[i][2];

            if (y0Val instanceof Fraction && bVal instanceof Fraction && y0Val.isPositive()) {
                const ratio = bVal.divide(y0Val);
                if (minRatio === null || ratio.toDecimal() < minRatio.toDecimal()) {
                    minRatio = ratio;
                    pivotRow = i;
                }
            }
        }

        if (pivotRow === -1) {
            console.error("Не найдена разрешающую строку для y₀");
            this.simplexIterations.push({
                error: "Невозможно найти разрешающую строку для y₀"
            });
            return null;
        }

        console.log("Разрешающий элемент: строка", pivotRow, "столбец", pivotCol);
        console.log("Базис до преобразования:", basis);
        console.log("Cбаз до преобразования:", basisCoeffs);

        try {
            const oldBasis = basis[pivotRow];
            const oldCoeff = basisCoeffs[pivotRow];

            this.pivot(table, pivotRow, pivotCol);

            // ВАЖНО: Cбаз для y₀ берется ИЗ ЦЕЛЕВОЙ ФУНКЦИИ
            basis[pivotRow] = 'y₀';
            basisCoeffs[pivotRow] = this.getObjectiveCoefficient('y₀');

            // Обновляем таблицу
            table[pivotRow][0] = 'y₀';
            table[pivotRow][1] = basisCoeffs[pivotRow];

            console.log("Базис после преобразования:", basis);
            console.log("Cбаз после преобразования:", basisCoeffs);
            console.log(`Заменяем ${oldBasis} (Cбаз=${oldCoeff}) на y₀ (Cбаз=${basisCoeffs[pivotRow]})`);

            const finalTable = this.removeArtificialColumn(table, basis, basisCoeffs, n, m);

            const finalDeltaRow = this.calculateDeltaRow(
                finalTable.table,
                finalTable.basisCoeffs,
                n, m,
                problem.objective
            );

            this.simplexIterations.push({
                step: "Итерация с y₀",
                table: finalTable.table,
                deltaRow: finalDeltaRow,
                basis: finalTable.basis,
                basisCoeffs: finalTable.basisCoeffs,
                header: finalTable.header,
                explanation: `После преобразования для y₀. Разрешающий элемент: строка ${pivotRow + 1}, столбец y₀ (заменяем ${oldBasis} на y₀)`
            });

            console.log("Симплекс-метод завершен успешно");
            return finalTable;

        } catch (error) {
            console.error("Ошибка при выполнении pivot:", error);
            this.simplexIterations.push({
                error: `Ошибка при выполнении преобразования: ${error.message}`
            });
            return null;
        }
    }

    pivot(table, pivotRow, pivotCol) {
        const pivotElement = table[pivotRow][pivotCol];
        if (!(pivotElement instanceof Fraction)) {
            throw new Error("Разрешающий элемент не является Fraction объектом");
        }

        const pivotElementClone = pivotElement.clone();

        // Сохраняем исходное значение Cбаз для разрешающей строки
        const originalBasisCoeff = table[pivotRow][1];

        // Нормализуем разрешающую строку (кроме столбца Cбаз!)
        for (let j = 2; j < table[pivotRow].length; j++) { // Начинаем с индекса 2 (столбец B)
            const cell = table[pivotRow][j];
            if (cell instanceof Fraction) {
                table[pivotRow][j] = cell.divide(pivotElementClone);
            }
        }

        // Обновляем остальные строки (кроме столбца Cбаз!)
        for (let i = 0; i < table.length; i++) {
            if (i !== pivotRow) {
                const factorCell = table[i][pivotCol];
                if (factorCell instanceof Fraction) {
                    const factor = factorCell.clone();
                    for (let j = 2; j < table[i].length; j++) { // Начинаем с индекса 2 (столбец B)
                        const cell = table[i][j];
                        const pivotCell = table[pivotRow][j];
                        if (cell instanceof Fraction && pivotCell instanceof Fraction) {
                            table[i][j] = cell.subtract(factor.multiply(pivotCell));
                        }
                    }
                }
            }
        }

        // ВОССТАНАВЛИВАЕМ исходное значение Cбаз для разрешающей строки
        table[pivotRow][1] = originalBasisCoeff;
    }

    removeArtificialColumn(table, basis, basisCoeffs, n, m) {
        const newTable = [];
        const newHeader = ['Баз', 'Cбаз', 'B', 'y₀'];
        for (let j = 1; j <= n; j++) newHeader.push(`y${j}`);

        const newBasis = basis.map(b => b === 'a₁' ? 'y₀' : b);

        // ВАЖНО: Cбаз берется ИЗ ЦЕЛЕВОЙ ФУНКЦИИ
        const newBasisCoeffs = basisCoeffs.map((c, index) => {
            if (basis[index] === 'a₁') {
                return this.getObjectiveCoefficient('y₀');
            }
            return c;
        });

        for (let i = 0; i < table.length; i++) {
            const newRow = [];

            newRow.push(newBasis[i]);
            newRow.push(newBasisCoeffs[i]);

            // Копируем все столбцы кроме последнего (искусственной переменной)
            for (let j = 2; j < table[i].length - 1; j++) {
                const cell = table[i][j];
                if (cell instanceof Fraction) {
                    newRow.push(cell.clone());
                } else {
                    newRow.push(cell);
                }
            }

            newTable.push(newRow);
        }

        console.log("После removeArtificialColumn:");
        console.log("Базис:", newBasis);
        console.log("Cбаз:", newBasisCoeffs);

        return {
            table: newTable,
            header: newHeader,
            basis: newBasis,
            basisCoeffs: newBasisCoeffs
        };
    }

    copyTable(table) {
        return table.map(row => row.map(cell => {
            if (cell instanceof Fraction) {
                return cell.clone();
            }
            return cell;
        }));
    }

    copyDeltaRow(deltaRow) {
        if (!deltaRow) return null;
        return deltaRow.map(cell => {
            if (cell instanceof Fraction) {
                return cell.clone();
            }
            return cell;
        });
    }

    // ПОЛНЫЙ СИМПЛЕКС-МЕТОД ДЛЯ ФИНАЛЬНОЙ ТАБЛИЦЫ
    performFullSimplex(finalTableData) {
        if (!finalTableData) {
            console.error("Нет финальной таблицы для симплекс-метода");
            return null;
        }

        console.log("Запуск полного симплекс-метода");

        this.finalSimplexIterations = [];

        let currentTable = this.copyTable(finalTableData.table);
        let currentBasis = [...finalTableData.basis];

        // ВАЖНО: Cбаз берется ИЗ ЦЕЛЕВОЙ ФУНКЦИИ, а не копируется
        let currentBasisCoeffs = currentBasis.map(basisVar =>
            this.getObjectiveCoefficient(basisVar)
        );

        // Обновляем Cбаз в самой таблице
        for (let i = 0; i < currentTable.length; i++) {
            currentTable[i][1] = currentBasisCoeffs[i];
        }

        let currentDeltaRow = this.calculateDeltaRow(
            currentTable,
            currentBasisCoeffs,
            finalTableData.header.length - 4,
            currentTable.length,
            this.transformedProblem.objective
        );

        let iteration = 1;
        const maxIterations = 20;

        while (iteration <= maxIterations) {
            console.log(`Итерация ${iteration} полного симплекс-метода`);

            // Проверяем оптимальность - все Δ ≥ 0?
            let isOptimal = true;
            if (currentDeltaRow) {
                for (let j = 3; j < currentDeltaRow.length; j++) {
                    const delta = currentDeltaRow[j];
                    if (delta instanceof Fraction && delta.isNegative()) {
                        isOptimal = false;
                        break;
                    }
                }
            }

            if (isOptimal) {
                console.log("Решение оптимально - все Δ ≥ 0");

                const optimalSolution = this.extractOptimalSolution(currentTable, currentBasis, currentBasisCoeffs, finalTableData.header.length - 4);

                this.finalSimplexIterations.push({
                    step: "ОПТИМАЛЬНОЕ РЕШЕНИЕ",
                    solution: optimalSolution,
                    explanation: "Все оценки Δ ≥ 0 - решение оптимально"
                });

                break;
            }

            // Находим разрешающий столбец (минимальная отрицательная дельта)
            let pivotCol = -1;
            let minDelta = new Fraction(0);

            if (currentDeltaRow) {
                for (let j = 3; j < currentDeltaRow.length; j++) {
                    const delta = currentDeltaRow[j];
                    if (delta instanceof Fraction && delta.isNegative() && delta.toDecimal() < minDelta.toDecimal()) {
                        minDelta = delta;
                        pivotCol = j;
                    }
                }
            }

            if (pivotCol === -1) {
                console.log("Решение оптимально - нет отрицательных дельт");
                break;
            }

            // Находим разрешающую строку (минимальное положительное отношение)
            let pivotRow = -1;
            let minRatio = null;

            for (let i = 0; i < currentTable.length; i++) {
                const pivotElement = currentTable[i][pivotCol];
                const bValue = currentTable[i][2];

                if (pivotElement instanceof Fraction && bValue instanceof Fraction &&
                    pivotElement.isPositive()) {

                    const ratio = bValue.divide(pivotElement);
                    if (minRatio === null || ratio.toDecimal() < minRatio.toDecimal()) {
                        minRatio = ratio;
                        pivotRow = i;
                    }
                }
            }

            if (pivotRow === -1) {
                console.log("Задача неограничена");
                this.finalSimplexIterations.push({
                    step: `Итерация ${iteration} - ЗАДАЧА НЕОГРАНИЧЕНА`,
                    table: this.copyTable(currentTable),
                    deltaRow: this.copyDeltaRow(currentDeltaRow),
                    basis: [...currentBasis],
                    basisCoeffs: [...currentBasisCoeffs],
                    header: [...finalTableData.header],
                    explanation: `Не найдена разрешающая строка для столбца ${finalTableData.header[pivotCol]} - задача неограничена`
                });
                break;
            }

            const oldBasis = currentBasis[pivotRow];
            const oldCoeff = currentBasisCoeffs[pivotRow];
            const newBasis = finalTableData.header[pivotCol];

            // ВАЖНО: Cбаз для новой переменной берется ИЗ ЦЕЛЕВОЙ ФУНКЦИИ
            const newCoeff = this.getObjectiveCoefficient(newBasis);

            console.log(`Разрешающий элемент: строка ${pivotRow}, столбец ${pivotCol}`);
            console.log(`Заменяем ${oldBasis} (Cбаз=${oldCoeff}) на ${newBasis} (Cбаз=${newCoeff})`);

            this.pivot(currentTable, pivotRow, pivotCol);

            // Обновляем базис и Cбаз (Cбаз берется из целевой функции)
            currentBasis[pivotRow] = newBasis;
            currentBasisCoeffs[pivotRow] = newCoeff;

            // Обновляем таблицу - ВАЖНО: Cбаз в таблице тоже обновляем
            currentTable[pivotRow][0] = newBasis;
            currentTable[pivotRow][1] = newCoeff;

            // Пересчитываем дельту (но Cбаз остается фиксированным из целевой функции)
            currentDeltaRow = this.calculateDeltaRow(
                currentTable,
                currentBasisCoeffs,
                finalTableData.header.length - 4,
                currentTable.length,
                this.transformedProblem.objective
            );

            this.finalSimplexIterations.push({
                step: `Итерация ${iteration}`,
                table: this.copyTable(currentTable),
                deltaRow: this.copyDeltaRow(currentDeltaRow),
                basis: [...currentBasis],
                basisCoeffs: [...currentBasisCoeffs],
                header: [...finalTableData.header],
                explanation: `Разрешающий элемент: строка ${pivotRow + 1} (${oldBasis}), столбец ${finalTableData.header[pivotCol]}. Заменяем ${oldBasis} на ${newBasis}`,
                pivot: { row: pivotRow, col: pivotCol }
            });

            iteration++;
        }

        if (iteration > maxIterations) {
            this.finalSimplexIterations.push({
                step: "ПРЕВЫШЕНО МАКСИМАЛЬНОЕ КОЛИЧЕСТВО ИТЕРАЦИЙ",
                table: this.copyTable(currentTable),
                deltaRow: this.copyDeltaRow(currentDeltaRow),
                basis: [...currentBasis],
                basisCoeffs: [...currentBasisCoeffs],
                header: [...finalTableData.header],
                explanation: "Достигнуто максимальное количество итераций (20)"
            });
        }

        return {
            table: currentTable,
            deltaRow: currentDeltaRow,
            basis: currentBasis,
            basisCoeffs: currentBasisCoeffs,
            header: finalTableData.header
        };
    }

    extractOptimalSolution(table, basis, basisCoeffs, n) {
        const solution = {
            variables: {},
            objectiveValue: new Fraction(0),
            originalVariables: {}
        };

        // Извлекаем значения переменных y
        for (let i = 0; i < basis.length; i++) {
            const varName = basis[i];
            const value = table[i][2];
            solution.variables[varName] = value instanceof Fraction ? value.clone() : new Fraction(value);

            // Вычисляем значение целевой функции
            if (basisCoeffs[i] instanceof Fraction) {
                solution.objectiveValue = solution.objectiveValue.add(
                    basisCoeffs[i].multiply(solution.variables[varName])
                );
            }
        }

        // Заполняем нулями отсутствующие переменные y
        const allVars = ['y₀'];
        for (let i = 1; i <= 10; i++) {
            allVars.push(`y${i}`);
        }
        allVars.forEach(varName => {
            if (!solution.variables[varName]) {
                solution.variables[varName] = new Fraction(0);
            }
        });

        // Вычисляем исходные переменные x = y / y₀
        const y0 = solution.variables['y₀'];
        if (!y0.isZero()) {
            for (let i = 1; i <= n; i++) {
                const yi = solution.variables[`y${i}`] || new Fraction(0);
                solution.originalVariables[`x${i}`] = yi.divide(y0);
            }
        } else {
            for (let i = 1; i <= n; i++) {
                solution.originalVariables[`x${i}`] = new Fraction(0);
            }
        }

        return solution;
    }
} performFullSimplex(finalTableData)


function generateProblem() {
    const n = parseInt(document.getElementById('numVariables').value);
    const m = parseInt(document.getElementById('numConstraints').value);

    let html = `
        <h2>Ввод коэффициентов</h2>
        <div class="objective-function">
            <h3>Целевая функция: максимизировать Z = (числитель) / (знаменатель)</h3>
            <div class="coefficients-group">
                <label>Числитель (коэффициенты при переменных):</label>
                <div class="coefficients-row">`;

    for (let i = 0; i < n; i++) {
        html += `<input type="number" id="num_${i}" placeholder="x${i + 1}" step="0.1">`;
    }

    html += `
                </div>
            </div>
            <div class="coefficients-group">
                <label>Числитель (свободный член):</label>
                <div class="coefficients-row">
                    <input type="number" id="num_const" placeholder="const" step="0.1" value="0">
                </div>
            </div>
            <div class="coefficients-group">
                <label>Знаменатель (коэффициенты при переменных):</label>
                <div class="coefficients-row">`;

    for (let i = 0; i < n; i++) {
        html += `<input type="number" id="den_${i}" placeholder="x${i + 1}" step="0.1">`;
    }
    html += `
                </div>
            </div>
            <div class="coefficients-group">
                <label>Знаменатель (свободный член):</label>
                <div class="coefficients-row">
                    <input type="number" id="den_const" placeholder="const" step="0.1" value="1">
                </div>
            </div>
        </div>
        
        <div class="constraints">
            <h3>Ограничения (только равенства):</h3>`;

    for (let i = 0; i < m; i++) {
        html += `
            <div class="constraint">
                <label>Ограничение ${i + 1}:</label>
                <div class="constraint-row">`;

        for (let j = 0; j < n; j++) {
            html += `<input type="number" id="a_${i}_${j}" placeholder="x${j + 1}" step="0.1">`;
        }

        html += `
                    <span>=</span>
                    <input type="number" id="b_${i}" placeholder="значение" step="0.1">
                </div>
            </div>`;
    }

    html += `
        </div>
        <button class="btn btn-solve" onclick="solveProblem()">Преобразовать и решить</button>`;

    document.getElementById('inputSection').innerHTML = html;
    console.log("Форма сгенерирована для n=", n, "m=", m);
}

function solveProblem() {
    console.log("Нажата кнопка 'Преобразовать и решить'");

    const n = parseInt(document.getElementById('numVariables').value);
    const m = parseInt(document.getElementById('numConstraints').value);

    console.log("Параметры: n=", n, "m=", m);

    const numeratorCoeffs = [];
    for (let i = 0; i < n; i++) {
        const val = document.getElementById(`num_${i}`).value;
        numeratorCoeffs.push(val === '' ? 0 : parseFloat(val));
    }
    const numeratorConst = parseFloat(document.getElementById('num_const').value) || 0;
    const numerator = { coeffs: numeratorCoeffs, constant: numeratorConst };

    const denominatorCoeffs = [];
    for (let i = 0; i < n; i++) {
        const val = document.getElementById(`den_${i}`).value;
        denominatorCoeffs.push(val === '' ? 0 : parseFloat(val));
    }
    const denominatorConst = parseFloat(document.getElementById('den_const').value) || 1;
    const denominator = { coeffs: denominatorCoeffs, constant: denominatorConst };

    const constraints = [];
    for (let i = 0; i < m; i++) {
        const coeffs = [];
        for (let j = 0; j < n; j++) {
            const val = document.getElementById(`a_${i}_${j}`).value;
            coeffs.push(val === '' ? 0 : parseFloat(val));
        }
        const value = parseFloat(document.getElementById(`b_${i}`).value) || 0;
        constraints.push({ coeffs, value });
    }

    console.log("Считанные данные:", { numerator, denominator, constraints });

    const hasData = numeratorCoeffs.some(c => c !== 0) || numeratorConst !== 0 ||
        denominatorCoeffs.some(c => c !== 0) || denominatorConst !== 1;

    if (!hasData) {
        document.getElementById('solution').innerHTML =
            '<div class="error">Пожалуйста, введите коэффициенты</div>';
        return;
    }

    try {
        const transformer = new FractionalLinearTransformer();
        const transformedProblem = transformer.transform(numerator, denominator, constraints, n);

        if (!transformedProblem) {
            document.getElementById('solution').innerHTML =
                '<div class="error">Ошибка при преобразовании задачи</div>';
            return;
        }

        const simplexResult = transformer.performSimplexForY0(numerator);

        let fullSimplexResult = null;
        if (simplexResult) {
            fullSimplexResult = transformer.performFullSimplex(simplexResult);
        }

        let resultHTML = '<div class="solution-process">';

        resultHTML += '<h3>Преобразование дробно-линейной задачи в линейную</h3>';

        if (transformer.transformationSteps.length > 0) {
            transformer.transformationSteps.forEach(step => {
                resultHTML += `<div class="transformation-step">`;
                resultHTML += `<h4>${step.step}</h4>`;
                resultHTML += step.description;
                resultHTML += `</div>`;
            });
        } else {
            resultHTML += '<p>Нет данных о преобразовании</p>';
        }

        if (transformer.simplexIterations.length > 0) {
            resultHTML += '<h3>Симплекс-метод для ввода y₀ в базис</h3>';

            transformer.simplexIterations.forEach((iteration, idx) => {
                resultHTML += `<div class="iteration">`;
                resultHTML += `<h4>${iteration.step}</h4>`;

                if (iteration.explanation) {
                    resultHTML += `<p class="explanation">${iteration.explanation}</p>`;
                }

                if (iteration.basis) {
                    resultHTML += `<p><strong>Базисные переменные:</strong> ${iteration.basis.join(', ')}</p>`;
                }

                if (iteration.pivot) {
                    resultHTML += `<p><strong>Разрешающий элемент:</strong> строка ${iteration.pivot.row}, столбец ${iteration.pivot.col}</p>`;
                }

                if (iteration.table) {
                    resultHTML += transformer.formatSimplexTable(iteration);
                }

                if (iteration.error) {
                    resultHTML += `<div class="error">${iteration.error}</div>`;
                }

                resultHTML += `</div>`;
            });
        }

        if (transformer.finalSimplexIterations.length > 0) {
            resultHTML += '<h3>Полный симплекс-метод</h3>';

            transformer.finalSimplexIterations.forEach((iteration, idx) => {
                resultHTML += `<div class="iteration">`;
                resultHTML += `<h4>${iteration.step}</h4>`;

                if (iteration.explanation) {
                    resultHTML += `<p class="explanation">${iteration.explanation}</p>`;
                }

                if (iteration.solution) {
                    resultHTML += `<div class="final-solution">`;
                    resultHTML += `<h4>Оптимальное решение:</h4>`;
                    resultHTML += `<p><strong>Целевая функция:</strong> Z = ${iteration.solution.objectiveValue.toString()}</p>`;

                    // Вывод переменных y
                    resultHTML += `<p><strong>Переменные y:</strong></p>`;
                    resultHTML += `<div class="variables">`;
                    Object.keys(iteration.solution.variables).forEach(varName => {
                        if (!iteration.solution.variables[varName].isZero() || varName === 'y₀') {
                            resultHTML += `<div class="variable">${varName} = ${iteration.solution.variables[varName].toString()}</div>`;
                        }
                    });
                    resultHTML += `</div>`;

                    // Вывод исходных переменных x с проверками
                    resultHTML += `<p><strong>Итоговый вектор x (xᵢ = yᵢ / y₀):</strong></p>`;
                    resultHTML += `<div class="variables">`;
                    const n = parseInt(document.getElementById('numVariables').value);

                    if (iteration.solution.originalVariables) {
                        for (let i = 1; i <= n; i++) {
                            const xi = iteration.solution.originalVariables[`x${i}`];
                            const yi = iteration.solution.variables[`y${i}`] || new Fraction(0);
                            const y0 = iteration.solution.variables['y₀'] || new Fraction(0);

                            if (xi && !y0.isZero()) {
                                resultHTML += `<div class="variable">x${i} = ${yi.toString()} / ${y0.toString()} = ${xi.toString()}</div>`;
                            } else if (xi) {
                                resultHTML += `<div class="variable">x${i} = ${xi.toString()}</div>`;
                            } else {
                                resultHTML += `<div class="variable">x${i} = не определен</div>`;
                            }
                        }
                    } else {
                        resultHTML += `<div class="error">Не удалось вычислить исходные переменные</div>`;
                    }
                    resultHTML += `</div>`;

                    // Векторная форма с проверками
                    if (iteration.solution.originalVariables) {
                        resultHTML += `<p><strong>Вектор x:</strong></p>`;
                        resultHTML += `<div class="vector">x = (`;
                        const xValues = [];
                        for (let i = 1; i <= n; i++) {
                            const xi = iteration.solution.originalVariables[`x${i}`];
                            if (xi) {
                                xValues.push(xi.toString());
                            } else {
                                xValues.push('не опр.');
                            }
                        }
                        resultHTML += xValues.join(', ') + `)</div>`;
                    }

                    resultHTML += `</div>`;
                }

                // ВЫВОДИМ ТАБЛИЦУ ТОЛЬКО ДЛЯ ИТЕРАЦИЙ, НЕ ДЛЯ ОПТИМАЛЬНОГО РЕШЕНИЯ
                if (iteration.table && !iteration.step.includes("ОПТИМАЛЬНОЕ РЕШЕНИЕ")) {
                    if (iteration.basis) {
                        resultHTML += `<p><strong>Базисные переменные:</strong> ${iteration.basis.join(', ')}</p>`;
                    }

                    if (iteration.pivot) {
                        resultHTML += `<p><strong>Разрешающий элемент:</strong> строка ${iteration.pivot.row + 1}, столбец ${iteration.header[iteration.pivot.col]}</p>`;
                    }

                    resultHTML += transformer.formatSimplexTable(iteration);
                }

                if (iteration.error) {
                    resultHTML += `<div class="error">${iteration.error}</div>`;
                }

                resultHTML += `</div>`;
            });
        }

        resultHTML += '</div>';
        document.getElementById('solution').innerHTML = resultHTML;

        console.log("Результаты выведены успешно");

    } catch (error) {
        console.error("Критическая ошибка:", error);
        document.getElementById('solution').innerHTML =
            `<div class="error">Критическая ошибка: ${error.message}</div>`;
    }
}

window.onload = function () {
    console.log("Страница загружена");
    generateProblem();
};
